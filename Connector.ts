import Fields = GoogleAppsScript.Data_Studio.Fields
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions

// @ts-ignore
declare const definitions: typeof import('./Definitions')



function getAuthType() {
    const AuthTypes = cc.AuthType
    return cc
        .newAuthTypeResponse()
        .setAuthType(AuthTypes.NONE)
        .build()
}

function getConfig(request) {
    const isFirstRequest = request.configParams === undefined
    const config = cc.getConfig()

    if (isFirstRequest) {
        config.setIsSteppedConfig(true)

        config.newInfo()
            .setId('urlInfo')
            .setText('This should be your Base URL without a trailing `/`. It should not contain `/hx/api`.')

        config.newTextInput()
            .setId('url')
            .setName('URL')

        config.newInfo()
            .setId('resetInfo')
            .setText('If you leave the username and password blank, it will use the current saved credentials.')

        config.newTextInput()
            .setId('username')
            .setName('Username')
        config.newTextInput()
            .setId('password')
            .setName('Password')
    }

    if (!isFirstRequest) {
        let hostSetsSelector = config.newSelectMultiple()
            .setId('hostSets')
            .setName('Host Set Selector')

        updateToken(request)

        const url = `${request.configParams.url}/hx/api/v3/host_sets?sort=_id`
        const requestOptions: URLFetchRequestOptions = {
            muteHttpExceptions: true,
            headers: {
                'X-FeAPI-Token' : userProperties.getProperty('x-feapi-token')
            }
        }

        const httpResponse = UrlFetchApp.fetch(url, requestOptions)
        const response = JSON.parse(httpResponse.getContentText())

        if (httpResponse.getResponseCode() !== 200) {
            cc.newUserError().setText('Error with accessing the API. Check your URL and credentials.').throwException()
        }

        response['data']['entries'].forEach(entry => {
            hostSetsSelector.addOption(config.newOptionBuilder().setLabel(entry['name']).setValue(entry['_id']))
        })
    }

    return config.build()
}

function getField(field: Fields, id: string): Fields {
    const section = dataDefinitions[id]
    section.build(field)
        .setId(section.id)
        .setName(section.name)
        .setType(section.type)
    return field
}

function getSchema(request) {
    const fields = Object.values(dataDefinitions)
        .map((value) => value.id)
        .reduce<Fields>((acc, id) => getField(acc, id), cc.getFields())

    fields.setDefaultMetric('online')
    fields.setDefaultDimension('id')

    return {
        'schema': fields.build()
    }
}


function getData(request) {
    if (userProperties.getProperty('x-feapi-token') === null) {
        updateToken(request)
    }

    let offset = 0
    let counter = -1
    let data: Object[] = []

    do {
        const url = `${request.configParams.url}/hx/api/plugins/host-management/v1/data?offset=${offset}`
        let requestOptions: URLFetchRequestOptions = {
            muteHttpExceptions: true,
            headers: {
                'X-FeAPI-Token' : userProperties.getProperty('x-feapi-token')
            }
        }

        let httpResponse = UrlFetchApp.fetch(url, requestOptions)

        // If we get denied, it means our X-FeAPI-Token is expired
        // Grab a new one and try again!
        if (httpResponse.getResponseCode() === 401) {
            updateToken(request)

            requestOptions = {
                muteHttpExceptions: true,
                headers: {
                    'X-FeAPI-Token' : userProperties.getProperty('x-feapi-token')
                }
            }

            httpResponse = UrlFetchApp.fetch(url, requestOptions)
        }

        // Log errors nicely for debugging
        if (httpResponse.getResponseCode() !== 200) {
            Logger.log('An exception occurred accessing the API:')
            Logger.log(httpResponse.getResponseCode())
            Logger.log(httpResponse.getAllHeaders())
            Logger.log(httpResponse.getContentText())
            throw new Error(`The API replied with an unsuccessful status code of ${httpResponse.getResponseCode()}`)
        }

        const tempData = JSON.parse(httpResponse.getContentText())

        // Set the counter to the total number only from the first page
        if (counter === -1) {
            counter = tempData['total']
        }

        // Append this page's data to the data array
        data = data.concat(tempData['data'])

        counter -= 50
        offset += 50
    } while (counter > 0)


    const hostsInHostSet = getListOfHostsInHostSet(request)

    const fieldIds: string[] = request.fields.map((field) => field.name)
    fieldIds.forEach(fieldId => {
        dataDefinitions[fieldId]
            .build(cc.getFields())
            .setId(dataDefinitions[fieldId].id)
            .setName(dataDefinitions[fieldId].name)
            .setType(dataDefinitions[fieldId].type)
    })

    const rows = data.filter(data => hostsInHostSet.length === 0 || hostsInHostSet.includes(data['id'])).map(dataPoint => {
        return {
            values: fieldIds.map(fieldId => dataDefinitions[fieldId].data(dataPoint))
        }
    })

    return {
        schema: cc.getFields().build(),
        rows: rows
    }
}


// This function gets a list of host set IDs when given a name
function getHostSetIds(request): number[] {
    const requestOptions: URLFetchRequestOptions = {
        muteHttpExceptions: true,
        headers: {
            'X-FeAPI-Token' : userProperties.getProperty('x-feapi-token')
        }
    }
    const url = `${request.configParams.url}/hx/api/v3/host_sets?sort=_id`
    const httpResponse = UrlFetchApp.fetch(url, requestOptions)

    return JSON.parse(httpResponse.getContentText())['data']['entries']
        .map(entry => entry['_id'])
        .filter(id => request.configParams.hostSets.includes(id))
}

// This function gets the list of Host ID's (note the difference)
// in the given host set. It uses the above function to get the host set IDs.
function getListOfHostsInHostSet(request): string[] {
    const hostSetIds = getHostSetIds(request)

    const requestOptions: URLFetchRequestOptions = {
        muteHttpExceptions: true,
        headers: {
            'X-FeAPI-Token' : userProperties.getProperty('x-feapi-token')
        }
    }


    let entries: string[] = []

    for (let i = 0; i < hostSetIds.length; i++) {
        const url = `${request.configParams.url}/hx/api/v3/hosts?sort=_id&host_sets._id=${hostSetIds[i]}`
        const httpResponse = UrlFetchApp.fetch(url, requestOptions)
        entries = entries.concat(JSON.parse(httpResponse.getContentText())['data']['entries'].map(entry => entry['_id']))
    }

    return entries
}


// This function fetches the API access token from the API
// and updates it in the user environment variables
function updateToken(request) {
    const userProperties = PropertiesService.getUserProperties()
    let username = userProperties.getProperty('username')
    let password = userProperties.getProperty('password')

    // If we aren't storing the username, get it from the input
    if (username === null || username === '' || typeof request.configParams.username !== 'undefined') {
        userProperties.setProperty('username', request.configParams.username)
        username = userProperties.getProperty('username')
    }
    // If we aren't storing the password, get it from the input
    if (password === null || password === '' || typeof request.constructor.password !== 'undefined') {
        userProperties.setProperty('password', request.configParams.password)
        password = userProperties.getProperty('password')
    }


    // Base64 hash the username and password, use it to authenticate with the FireEye API
    // and finally set our X-FeAPI-Token in the properties and use it until it expires
    const base64 = Utilities.base64Encode(`${username}:${password}`)
    const requestOptions: URLFetchRequestOptions = {
        'headers' : {
            'Authorization' : `Basic ${base64}`
        }
    }
    const url = `${request.configParams.url}/hx/api/v3/token`
    const httpResponse = UrlFetchApp.fetch(url, requestOptions)
    userProperties.setProperty('x-feapi-token', httpResponse.getHeaders()['x-feapi-token'])
}


function isAdminUser() {
    return false
}