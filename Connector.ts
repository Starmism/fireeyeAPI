import Fields = GoogleAppsScript.Data_Studio.Fields;
import Config = GoogleAppsScript.Data_Studio.Config;
import GetAuthTypeResponse = GoogleAppsScript.Data_Studio.GetAuthTypeResponse;

const cc = DataStudioApp.createCommunityConnector();
const dsTypes = cc.FieldType;
const dsAggregationTypes = cc.AggregationType;

function getAuthType(): GetAuthTypeResponse {
    const AuthTypes = cc.AuthType;
    return cc
        .newAuthTypeResponse()
        .setAuthType(AuthTypes.NONE)
        .build();
}

function getConfig(request): Config {
    const userProperties = PropertiesService.getUserProperties();
    const config = cc.getConfig();

    config.newTextInput()
        .setId('url')
        .setName('URL');

    if (userProperties.getProperties().hasOwnProperty('username') && userProperties.getProperties().hasOwnProperty('password')) {
        return config.build();
    }

    config.newTextInput()
        .setId('username')
        .setName('Username');
    config.newTextInput()
        .setId('password')
        .setName('Password');

    return config.build();
}

function _getField(fields: Fields, fieldID: String): Fields {
    switch (fieldID) {
        case 'id':
            fields
                .newDimension()
                .setId('id')
                .setName('Endpoint Agent ID')
                .setType(dsTypes.TEXT);
            break;
        case 'serverTime':
            fields
                .newDimension()
                .setId('serverTime')
                .setName('Server Time')
                .setType(dsTypes.YEAR_MONTH_DAY_SECOND);
            break;
        case 'hostname':
            fields
                .newDimension()
                .setId('hostname')
                .setName('Hostname')
                .setType(dsTypes.TEXT);
            break;
        case 'online':
            fields
                .newMetric()
                .setId('online')
                .setName('Online Status')
                .setType(dsTypes.BOOLEAN)
                .setAggregation(dsAggregationTypes.COUNT);
            break;
        case 'productName':
            fields
                .newDimension()
                .setId('productName')
                .setName('Operating System')
                .setType(dsTypes.TEXT);
            break;
        case 'patchLevel':
            fields
                .newDimension()
                .setId('patchLevel')
                .setName('Patch')
                .setType(dsTypes.TEXT);
            break;
        case 'buildNumber':
            fields
                .newDimension()
                .setId('buildNumber')
                .setName('Build')
                .setType(dsTypes.TEXT);
            break;
        case 'loggedOnUser':
            fields
                .newDimension()
                .setId('loggedOnUser')
                .setName('Logged-On User')
                .setType(dsTypes.TEXT);
            break;
        case 'timezone':
            fields
                .newDimension()
                .setId('timezone')
                .setName('Time Zone')
                .setType(dsTypes.TEXT);
            break;
        case 'lastCheckin':
            fields
                .newDimension()
                .setId('lastCheckin')
                .setName('Last Check-In')
                .setType(dsTypes.YEAR_MONTH_DAY_SECOND);
            break;
        case 'appVersion':
            fields
                .newDimension()
                .setId('appVersion')
                .setName('Agent Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'cloudProvider':
            fields
                .newDimension()
                .setId('cloudProvider')
                .setName('Cloud Provider')
                .setType(dsTypes.TEXT);
            break;
        case 'instanceID':
            fields
                .newDimension()
                .setId('instanceID')
                .setName('Instance ID')
                .setType(dsTypes.TEXT);
            break;
        case 'containmentState':
            fields
                .newDimension()
                .setId('containmentState')
                .setName('Containment State')
                .setType(dsTypes.TEXT);
            break;
        case 'realTimeStatus':
            fields
                .newDimension()
                .setId('realTimeStatus')
                .setName('Real Time')
                .setType(dsTypes.TEXT);
            break;
        case 'intelVersion':
            fields
                .newDimension()
                .setId('intelVersion')
                .setName('Content Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'intelTimestamp':
            fields
                .newDimension()
                .setId('intelTimestamp')
                .setName('Real Time Content Updated')
                .setType(dsTypes.YEAR_MONTH_DAY_SECOND);
            break;
        case 'ExdPluginStatus':
            fields
                .newDimension()
                .setId('ExdPluginStatus')
                .setName('Exploit Guard')
                .setType(dsTypes.TEXT);
            break;
        case 'exdContentVersion':
            fields
                .newDimension()
                .setId('exdContentVersion')
                .setName('EXD Content Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'exdEngineVersion':
            fields
                .newDimension()
                .setId('exdEngineVersion')
                .setName('EXD Engine Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'malwareGuard':
            fields
                .newDimension()
                .setId('malwareGuard')
                .setName('Malware Guard')
                .setType(dsTypes.TEXT);
            break;
        case 'malwareGuardQuarantineStatus':
            fields
                .newDimension()
                .setId('malwareGuardQuarantineStatus')
                .setName('Malware Guard Quarantine')
                .setType(dsTypes.TEXT);
            break;
        case 'malwareContentVersion':
            fields
                .newDimension()
                .setId('malwareContentVersion')
                .setName('Malware Guard Model')
                .setType(dsTypes.NUMBER);
            break;
        case 'malwareMgContentUpdated':
            fields
                .newDimension()
                .setId('malwareMgContentUpdated')
                .setName('Malware Guard Model Last Updated')
                .setType(dsTypes.YEAR_MONTH_DAY_SECOND);
            break;
        case 'malwareMgEngineVersion':
            fields
                .newDimension()
                .setId('malwareMgEngineVersion')
                .setName('Malware Guard Engine Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'malwareMgCoreEngineVersion':
            fields
                .newDimension()
                .setId('malwareMgCoreEngineVersion')
                .setName('Malware Guard Core Engine Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'malwareProtectionStatus':
            fields
                .newDimension()
                .setId('malwareProtectionStatus')
                .setName('Malware Protection')
                .setType(dsTypes.TEXT);
            break;
        case 'malwareAVstatus':
            fields
                .newDimension()
                .setId('malwareAVstatus')
                .setName('Signature and Heuristic Detection')
                .setType(dsTypes.TEXT);
            break;
        case 'malwareAVQuarantineStatus':
            fields
                .newDimension()
                .setId('malwareAVQuarantineStatus')
                .setName('Signature and Heuristic Detection Quarantine')
                .setType(dsTypes.TEXT);
            break;
        case 'malwareAvContentVersion':
            fields
                .newDimension()
                .setId('malwareAvContentVersion')
                .setName('Signature and Heuristic Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'malwareAvContentUpdated':
            fields
                .newDimension()
                .setId('malwareAvContentUpdated')
                .setName('AV Content Last Updated')
                .setType(dsTypes.YEAR_MONTH_DAY_SECOND);
            break;
        case 'malwareAvEngineVersion':
            fields
                .newDimension()
                .setId('malwareAvEngineVersion')
                .setName('AV Engine Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'quarantineActions':
            fields
                .newDimension()
                .setId('quarantineActions')
                .setName('Quarantine Actions')
                .setType(dsTypes.TEXT);
            break;
        case 'fips':
            fields
                .newDimension()
                .setId('fips')
                .setName('FIPS')
                .setType(dsTypes.TEXT);
            break;
        case 'proRemSvcStatus':
            fields
                .newDimension()
                .setId('proRemSvcStatus')
                .setName('ProRemSvcStatus')
                .setType(dsTypes.TEXT);
            break;
        case 'kernelServicesStatus':
            fields
                .newDimension()
                .setId('kernelServicesStatus')
                .setName('Kernel Services Status')
                .setType(dsTypes.TEXT);
            break;
        case 'machineName':
            fields
                .newDimension()
                .setId('machineName')
                .setName('Machine Name')
                .setType(dsTypes.TEXT);
            break;
        case 'uptime':
            fields
                .newDimension()
                .setId('uptime')
                .setName('Uptime')
                .setType(dsTypes.DURATION);
            break;
        case 'regOrg':
            fields
                .newDimension()
                .setId('regOrg')
                .setName('Registered Org')
                .setType(dsTypes.TEXT);
            break;
        case 'regOwner':
            fields
                .newDimension()
                .setId('regOwner')
                .setName('Registered Owner')
                .setType(dsTypes.TEXT);
            break;
        case 'platform':
            fields
                .newDimension()
                .setId('platform')
                .setName('Platform')
                .setType(dsTypes.TEXT);
            break;
        case 'vmGuest':
            fields
                .newMetric()
                .setId('vmGuest')
                .setName('VM Guest')
                .setType(dsTypes.BOOLEAN)
                .setAggregation(dsAggregationTypes.COUNT);
            break;
        case 'virtualization':
            fields
                .newDimension()
                .setId('virtualization')
                .setName('Virtualization')
                .setType(dsTypes.TEXT);
            break;
        case 'gmtoffset':
            fields
                .newDimension()
                .setId('gmtoffset')
                .setName('GMT Offset')
                .setType(dsTypes.TEXT);
            break;
        case 'domain':
            fields
                .newDimension()
                .setId('domain')
                .setName('Domain')
                .setType(dsTypes.TEXT);
            break;
        case 'primaryIpv4Address':
            fields
                .newDimension()
                .setId('primaryIpv4Address')
                .setName('Primary IPv4 Address')
                .setType(dsTypes.TEXT);
            break;
        case 'primaryIpAddress':
            fields
                .newDimension()
                .setId('primaryIpAddress')
                .setName('Primary IP Address')
                .setType(dsTypes.TEXT);
            break;
        case 'mac':
            fields
                .newDimension()
                .setId('mac')
                .setName('MAC Address')
                .setType(dsTypes.TEXT);
            break;
        case 'totalphysical':
            fields
                .newDimension()
                .setId('totalphysical')
                .setName('Total Storage (GB)')
                .setType(dsTypes.NUMBER);
            break;
        case 'availphysical':
            fields
                .newDimension()
                .setId('availphysical')
                .setName('Available Storage (GB)')
                .setType(dsTypes.TEXT);
            break;
        case 'ExdPluginVersion':
            fields
                .newDimension()
                .setId('ExdPluginVersion')
                .setName('ExdPlugin Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'EndpointUIStatus':
            fields
                .newDimension()
                .setId('EndpointUIStatus')
                .setName('Endpoint UI Status')
                .setType(dsTypes.TEXT);
            break;
        case 'EndpointUIVersion':
            fields
                .newDimension()
                .setId('EndpointUIVersion')
                .setName('Endpoint UI Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'LogonTrackerStatus':
            fields
                .newDimension()
                .setId('LogonTrackerStatus')
                .setName('LogonTracker Status')
                .setType(dsTypes.TEXT);
            break;
        case 'LogonTrackerVersion':
            fields
                .newDimension()
                .setId('LogonTrackerVersion')
                .setName('LogonTracker Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'ProcessTrackerStatus':
            fields
                .newDimension()
                .setId('ProcessTrackerStatus')
                .setName('ProcessTracker Status')
                .setType(dsTypes.TEXT);
            break;
        case 'ProcessTrackerVersion':
            fields
                .newDimension()
                .setId('ProcessTrackerVersion')
                .setName('ProcessTracker Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'UACProtectStatus':
            fields
                .newDimension()
                .setId('UACProtectStatus')
                .setName('UACProtect Status')
                .setType(dsTypes.TEXT);
            break;
        case 'UACProtectVersion':
            fields
                .newDimension()
                .setId('UACProtectVersion')
                .setName('UACProtect Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'AmsiStatus':
            fields
                .newDimension()
                .setId('AmsiStatus')
                .setName('Amsi Status')
                .setType(dsTypes.TEXT);
            break;
        case 'AmsiVersion':
            fields
                .newDimension()
                .setId('AmsiVersion')
                .setName('Amsi Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'EventStreamerStatus':
            fields
                .newDimension()
                .setId('EventStreamerStatus')
                .setName('EventStreamer Status')
                .setType(dsTypes.TEXT);
            break;
        case 'EventStreamerVersion':
            fields
                .newDimension()
                .setId('EventStreamerVersion')
                .setName('EventStreamer Version')
                .setType(dsTypes.NUMBER);
            break;
        case 'HostRemediationStatus':
            fields
                .newDimension()
                .setId('HostRemediationStatus')
                .setName('HostRemediation Status')
                .setType(dsTypes.TEXT);
            break;
        case 'HostRemediationVersion':
            fields
                .newDimension()
                .setId('HostRemediationVersion')
                .setName('HostRemediation Version')
                .setType(dsTypes.NUMBER);
            break;
        default:
            throw new Error(`Invalid fieldID: ${fieldID}`);
    }
    return fields;
}

function getSchema(request) {
    let fields = cc.getFields();
    [
        'id', 'serverTime', 'hostname', 'online', 'productName', 'patchLevel', 'buildNumber', 'loggedOnUser',
        'timezone', 'lastCheckin', 'appVersion', 'cloudProvider', 'instanceID', 'containmentState', 'realTimeStatus',
        'intelVersion', 'intelTimestamp', 'ExdPluginStatus', 'exdContentVersion', 'exdEngineVersion', 'malwareGuard',
        'malwareGuardQuarantineStatus', 'malwareContentVersion', 'malwareMgContentUpdated', 'malwareMgEngineVersion',
        'malwareMgCoreEngineVersion', 'malwareProtectionStatus', 'malwareAVstatus', 'malwareAVQuarantineStatus',
        'malwareAvContentVersion', 'malwareAvContentUpdated', 'malwareAvEngineVersion', 'quarantineActions',
        'fips', 'proRemSvcStatus', 'kernelServicesStatus', 'machineName', 'uptime', 'regOrg', 'regOwner', 'platform',
        'vmGuest', 'virtualization', 'gmtoffset', 'domain', 'primaryIpv4Address', 'primaryIpAddress', 'mac',
        'totalphysical', 'availphysical', 'ExdPluginVersion', 'EndpointUIStatus', 'EndpointUIVersion', 'LogonTrackerStatus',
        'LogonTrackerVersion', 'ProcessTrackerStatus', 'ProcessTrackerVersion', 'UACProtectStatus', 'UACProtectVersion',
        'AmsiStatus', 'AmsiVersion', 'EventStreamerStatus', 'EventStreamerVersion', 'HostRemediationStatus', 'HostRemediationVersion'
    ].forEach(fieldId => {
        fields = _getField(fields, fieldId);
    });

    fields.setDefaultMetric('online');
    fields.setDefaultDimension('id');
    return {
        'schema': fields.build()
    };
}


function _getDataField(entity, fieldId) {
    switch (fieldId) {
        case 'id':
            return entity['id']
        case 'serverTime':
            const date = fixDate(entity, 'serverTime')
            if (date !== undefined) {
                return date.substring(0, 15)
            }
            return date
        case 'hostname':
            return entity['hostname']
        case 'online':
            return entity['online'] === 'online'
        case 'productName':
            return entity['productName']
        case 'patchLevel':
            return entity['patchLevel']
        case 'buildNumber':
            return entity['buildNumber']
        case 'loggedOnUser':
            return entity['loggedOnUser']
        case 'timezone':
            return entity['timezone']
        case 'lastCheckin':
            return fixDate(entity, 'lastCheckin')
        case 'appVersion':
            return checkFloat(entity, 'appVersion')
        case 'cloudProvider':
            return entity['cloudProvider']
        case 'instanceID':
            return checkFloat(entity, 'instanceID')
        case 'containmentState':
            return entity['containmentStatus']
        case 'realTimeStatus':
            return entity['realTimeStatus']
        case 'intelVersion':
            return checkFloat(entity, 'intelVersion')
        case 'intelTimestamp':
            return fixDate(entity, 'intelTimestamp')
        case 'ExdPluginStatus':
            return entity['ExdPluginStatus']
        case 'exdContentVersion':
            return checkFloat(entity, 'exdContentVersion')
        case 'exdEngineVersion':
            return checkFloat(entity, 'exdEngineVersion')
        case 'malwareGuard':
            return entity['malwareGuard']
        case 'malwareGuardQuarantineStatus':
            return entity['malwareGuardQuarantineStatus']
        case 'malwareContentVersion':
            return checkFloat(entity, 'malwareContentVersion')
        case 'malwareMgContentUpdated':
            return fixDate(entity, 'malwareMgContentUpdated')
        case 'malwareMgEngineVersion':
            return checkFloat(entity, 'malwareMgEngineVersion');
        case 'malwareMgCoreEngineVersion':
            return checkFloat(entity, 'malwareMgCoreEngineVersion');
        case 'malwareProtectionStatus':
            return entity['malwareProtectionStatus']
        case 'malwareAVstatus':
            return entity['malwareAVstatus']
        case 'malwareAVQuarantineStatus':
            return entity['malwareAVQuarantineStatus']
        case 'malwareAvContentVersion':
            return checkFloat(entity, 'malwareAvContentVersion')
        case 'malwareAvContentUpdated':
            return fixDate(entity, 'malwareAvContentUpdated')
        case 'malwareAvEngineVersion':
            return checkFloat(entity, 'malwareAvEngineVersion')
        case 'quarantineActions':
            return entity['quarantineActions']
        case 'fips':
            return entity['fips']
        case 'proRemSvcStatus':
            return entity['proRemSvcStatus']
        case 'kernelServicesStatus':
            return entity['kernelServicesStatus']
        case 'machineName':
            return entity['machineName']
        case 'uptime':
            const uptimeArray = entity['uptime'].split(' ')
            return ((uptimeArray[0] * 86400) + (uptimeArray[2] * 3600) + (uptimeArray[4] * 60) + uptimeArray[6])
        case 'regOrg':
            return entity['regOrg']
        case 'regOwner':
            return entity['regOwner']
        case 'platform':
            return entity['platform']
        case 'vmGuest':
            return entity['vmGuest'] === 'Yes'
        case 'virtualization':
            return entity['virtualization']
        case 'gmtoffset':
            return entity['gmtoffset']
        case 'domain':
            return entity['domain']
        case 'primaryIpv4Address':
            return entity['primaryIpv4Address']
        case 'primaryIpAddress':
            return entity['primaryIpAddress']
        case 'mac':
            return entity['mac']
        case 'totalphysical':
            return checkFloat(entity, 'totalphysical')
        case 'availphysical':
            return checkFloat(entity, 'availphysical')
        case 'ExdPluginVersion':
            return checkFloat(entity, 'ExdPluginVersion')
        case 'EndpointUIStatus':
            return entity['EndpointUIStatus']
        case 'EndpointUIVersion':
            return checkFloat(entity, 'EndpointUIVersion')
        case 'LogonTrackerStatus':
            return entity['LogonTrackerStatus'];
        case 'LogonTrackerVersion':
            return checkFloat(entity, 'LogonTrackerVersion')
        case 'ProcessTrackerStatus':
            return entity['ProcessTrackerStatus']
        case 'ProcessTrackerVersion':
            return checkFloat(entity, 'ProcessTrackerVersion')
        case 'UACProtectStatus':
            return entity['UACProtectStatus']
        case 'UACProtectVersion':
            return checkFloat(entity, 'UACProtectVersion')
        case 'AmsiStatus':
            return entity['AmsiStatus']
        case 'AmsiVersion':
            return checkFloat(entity, 'AmsiVersion')
        case 'EventStreamerStatus':
            return entity['EventStreamerStatus']
        case 'EventStreamerVersion':
            return checkFloat(entity, 'EventStreamerVersion')
        case 'HostRemediationStatus':
            return entity['HostRemediationStatus']
        case 'HostRemediationVersion':
            return checkFloat(entity, 'HostRemediationVersion')
        default:
            throw new Error(`Invalid data fieldId: ${fieldId}`)
    }
}

function checkFloat(entity, num) {
    const replacedNum = entity[num].replace(/./g, '')
    const parsedNum = parseInt(entity[replacedNum]);
    return isNaN(parsedNum) ? -1 : parsedNum;
}

function fixDate(entity, date) {
    const parsedDate = entity[date]
    if (parsedDate !== undefined) {
        return entity[date].replace(/-/g, '').replace(/:/g, '').replace(/T/g, '').replace(/Z/g, '')
    }
    return parsedDate
}


function getData(request) {
    const userProperties = PropertiesService.getUserProperties();
    let fields = cc.getFields();
    const fieldIds = request.fields.map(field => field.name);
    fieldIds.forEach(fieldId => {
        fields = _getField(fields, fieldId);
    });

    if (userProperties.getProperty('x-feapi-token') === null) {
        getNewToken(request)
    }

    const url = request.configParams.url + 'data';
    let requestOptions = {
        muteHttpExceptions: true,
        method: 'GET',
        headers: {
            'X-FeAPI-Token' : userProperties.getProperty('x-feapi-token')
        }
    };
    // @ts-ignore
    let httpResponse = UrlFetchApp.fetch(url, requestOptions);

    if (httpResponse.getResponseCode() === 401) {
        getNewToken(request);

        requestOptions = {
            muteHttpExceptions: true,
            method: 'GET',
            headers: {
                'X-FeAPI-Token' : userProperties.getProperty('x-feapi-token')
            }
        };
        // @ts-ignore
        httpResponse = UrlFetchApp.fetch(url, requestOptions);
    }

    // handle errors from the API
    if (httpResponse.getResponseCode() !== 200) {
        Logger.log('An exception occurred accessing the API:');
        Logger.log(httpResponse.getResponseCode());
        Logger.log(httpResponse.getAllHeaders());
        Logger.log(httpResponse.getContentText());
        // TODO: Return an error to the user
        throw new Error(`The API replied with an unsuccessful status code of ${httpResponse.getResponseCode()}`);
    }


    const data: Object = JSON.parse(httpResponse.getContentText());

    const rows = data['data'].map(dataPoint => {
        return {
            values: fieldIds.map(fieldId => _getDataField(dataPoint, fieldId))
        };
    });

    return {
        schema: fields.build(),
        rows: rows
    };
}

function getNewToken(request) {
    const userProperties = PropertiesService.getUserProperties();
    let username = userProperties.getProperty('username')
    let password = userProperties.getProperty('password')
    if (username === null || username === '') {
        userProperties.setProperty('username', request.configParams.username)
        username = userProperties.getProperty('username')
    }
    if (password === null || password === '') {
        userProperties.setProperty('password', request.configParams.password)
        password = userProperties.getProperty('password')
    }




    const base64 = Utilities.base64Encode(`${username}:${password}`)
    const requestOptions = {
        'method' : 'GET',
        'headers' : {
            'Authorization' : `Basic ${base64}`
        }
    };
    const urlRaw = request.configParams.url;
    const url = urlRaw.substring(0, urlRaw.search('.com') + 4) + '/hx/api/v3/token';
    // @ts-ignore
    const httpResponse = UrlFetchApp.fetch(url, requestOptions);
    // @ts-ignore
    userProperties.setProperty('x-feapi-token', httpResponse.getHeaders()['x-feapi-token'])
}


function isAdminUser() {
    return false;
}