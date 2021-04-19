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

    if (userProperties.getProperties().hasOwnProperty('username') && userProperties.getProperties().hasOwnProperty('password')) {
        config.newCheckbox()
            .setId('reset')
            .setName('Reset Credentials?')

        return config.build()
    }

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
    const fields = Object.values(dataDefinitions)
        .map((value) => value.id)
        .reduce<Fields>((acc, id) => getField(acc, id), cc.getFields())

    // If they check the reset box, reset their username & password
    if (userProperties.getProperty('reset') !== null) {
        userProperties.setProperty('username', null)
        userProperties.setProperty('password', null)
    }

    if (userProperties.getProperty('x-feapi-token') === null) {
        getNewToken(request)
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
        getNewToken(request)

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


    const data: Object = JSON.parse(httpResponse.getContentText())
    const fieldIds: string[] = request.fields.map(field => field.name);

    const rows = data['data'].map((dataPoint) => ({
        values: fieldIds.map(fieldId => dataDefinitions[fieldId].data(dataPoint))
    }))
    console.log(rows)
    console.log(fieldIds)
    return {
        schema: fields.build(),
        rows: rows
    }
}

function getNewToken(request) {
    const userProperties = PropertiesService.getUserProperties()
    let username = userProperties.getProperty('username')
    let password = userProperties.getProperty('password')

    // If we aren't storing the username, get it from the input
    if (username === null || username === '') {
        userProperties.setProperty('username', request.configParams.username)
        username = userProperties.getProperty('username')
    }
    // If we aren't storing the password, get it from the input
    if (password === null || password === '') {
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