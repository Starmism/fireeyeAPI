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
    const config = cc.getConfig()

    config.newTextInput()
        .setId('url')
        .setName('URL')

    config.newInfo()
        .setId('hostSetInfo')
        .setText('The Host Set Name is optional. It allows you to filter returned hosts by a host set name.')

    config.newTextInput()
        .setId('hostSetName')
        .setName('Host Set Name')

    config.newInfo()
        .setId('resetInfo')
        .setText('If you leave the username and password blank, it will use the current saved credentials.')

    config.newTextInput()
        .setId('username')
        .setName('Username')
    config.newTextInput()
        .setId('password')
        .setName('Password')

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

    const url = request.configParams.url + 'data'
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

    const hostsInHostSet = getListOfHostsInHostSet(request)

    const data: Object = JSON.parse(httpResponse.getContentText())

    const fieldIds: string[] = request.fields.map((field) => field.name)
    fieldIds.forEach(fieldId => {
        dataDefinitions[fieldId]
            .build(cc.getFields())
            .setId(dataDefinitions[fieldId].id)
            .setName(dataDefinitions[fieldId].name)
            .setType(dataDefinitions[fieldId].type)
    })

    const rows = data['data'].filter(data => hostsInHostSet.includes(data['id'])).map(dataPoint => {
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
    const urlRaw = request.configParams.url
    const hostSetName = request.configParams.hostSetName
    const url = urlRaw.substring(0, urlRaw.search('.com') + 4) + '/hx/api/v3/host_sets?sort=_id&name=' + hostSetName
    const httpResponse = UrlFetchApp.fetch(url, requestOptions)
    return JSON.parse(httpResponse.getContentText())['data']['entries'].map(entry => entry['_id'])
}

// This function gets the list of Host ID's (note the difference)
// in the given host set. It uses the above function to get the host set ID.
function getListOfHostsInHostSet(request): string[] {
    const hostSetIds = getHostSetIds(request)

    const requestOptions: URLFetchRequestOptions = {
        muteHttpExceptions: true,
        headers: {
            'X-FeAPI-Token' : userProperties.getProperty('x-feapi-token')
        }
    }
    const urlRaw = request.configParams.url
    const url = urlRaw.substring(0, urlRaw.search('.com') + 4) + '/hx/api/v3/hosts?sort=_id&host_sets._id=' + hostSetIds[0]
    const httpResponse = UrlFetchApp.fetch(url, requestOptions)
    return JSON.parse(httpResponse.getContentText())['data']['entries'].map(entry => entry['_id'])
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
    const urlRaw = request.configParams.url
    const url = urlRaw.substring(0, urlRaw.search('.com') + 4) + '/hx/api/v3/token'
    const httpResponse = UrlFetchApp.fetch(url, requestOptions)
    userProperties.setProperty('x-feapi-token', httpResponse.getHeaders()['x-feapi-token'])
}


function isAdminUser() {
    return false
}