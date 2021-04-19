const buildMetric = (fields: Fields) => fields.newMetric()
const buildDimension = (fields: Fields) => fields.newDimension()

const cc = DataStudioApp.createCommunityConnector();
const dsTypes = cc.FieldType;
const userProperties = PropertiesService.getUserProperties();

const dataDefinitions = {
    'id' : {
        'build' : buildDimension,
        'id'    : 'id',
        'name'  : 'Endpoint Agent ID',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['id']
    },
    'serverTime' : {
        'build' : buildDimension,
        'id'    : 'serverTime',
        'name'  : 'Server Time',
        'type'  : dsTypes.YEAR_MONTH_DAY_SECOND,
        'data'  : (entity) => {
            const date = fixDate(entity, 'serverTime')
            return date?.substring(0, 15)
        }
    },
    'hostname' : {
        'build' : buildDimension,
        'id'    : 'hostname',
        'name'  : 'Hostname',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['hostname']
    },
    'online' : {
        'build' : buildMetric,
        'id'    : 'online',
        'name'  : 'Online Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => {
            const onlineStatus = entity['online']
            return onlineStatus?.charAt(0).toUpperCase() + onlineStatus?.slice(1)
        }
    },
    'productName' : {
        'build' : buildDimension,
        'id'    : 'productName',
        'name'  : 'Operating System',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['productName']
    },
    'patchLevel' : {
        'build' : buildDimension,
        'id'    : 'patchLevel',
        'name'  : 'Patch',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['patchLevel']
    },
    'buildNumber' : {
        'build' : buildDimension,
        'id'    : 'buildNumber',
        'name'  : 'Build',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['buildNumber']
    },
    'loggedOnUser' : {
        'build' : buildDimension,
        'id'    : 'loggedOnUser',
        'name'  : 'Logged-On User',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['loggedOnUser']
    },
    'timezone' : {
        'build' : buildDimension,
        'id'    : 'timezone',
        'name'  : 'Time Zone',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['timezone']
    },
    'lastCheckin' : {
        'build' : buildDimension,
        'id'    : 'lastCheckin',
        'name'  : 'Last Check-In',
        'type'  : dsTypes.YEAR_MONTH_DAY_SECOND,
        'data'  : (entity) => fixDate(entity, 'lastCheckin')
    },
    'appVersion' : {
        'build' : buildDimension,
        'id'    : 'appVersion',
        'name'  : 'Agent Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['appVersion']
    },
    'cloudProvider' : {
        'build' : buildDimension,
        'id'    : 'cloudProvider',
        'name'  : 'Cloud Provider',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['cloudProvider']
    },
    'instanceID' : {
        'build' : buildDimension,
        'id'    : 'instanceID',
        'name'  : 'Instance ID',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['instanceID']
    },
    'containmentState' : {
        'build' : buildDimension,
        'id'    : 'containmentState',
        'name'  : 'Containment State',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['containmentState']
    },
    'realTimeStatus' : {
        'build' : buildDimension,
        'id'    : 'realTimeStatus',
        'name'  : 'Real Time',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['realTimeStatus']
    },
    'intelVersion' : {
        'build' : buildDimension,
        'id'    : 'intelVersion',
        'name'  : 'Content Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['intelVersion']
    },
    'intelTimestamp' : {
        'build' : buildDimension,
        'id'    : 'intelTimestamp',
        'name'  : 'Real Time Content Updated',
        'type'  : dsTypes.YEAR_MONTH_DAY_SECOND,
        'data'  : (entity) => fixDate(entity, 'intelTimestamp')
    },
    'ExdPluginStatus' : {
        'build' : buildDimension,
        'id'    : 'ExdPluginStatus',
        'name'  : 'Exploit Guard',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['ExdPluginStatus']
    },
    'exdContentVersion' : {
        'build' : buildDimension,
        'id'    : 'exdContentVersion',
        'name'  : 'EXD Content Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['exdContentVersion']
    },
    'exdEngineVersion' : {
        'build' : buildDimension,
        'id'    : 'exdEngineVersion',
        'name'  : 'EXD Engine Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['exdEngineVersion']
    },
    'malwareGuard' : {
        'build' : buildDimension,
        'id'    : 'malwareGuard',
        'name'  : 'Malware Guard',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareGuard']
    },
    'malwareGuardQuarantineStatus' : {
        'build' : buildDimension,
        'id'    : 'malwareGuardQuarantineStatus',
        'name'  : 'Malware Guard Quarantine',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareGuardQuarantineStatus']
    },
    'malwareContentVersion' : {
        'build' : buildDimension,
        'id'    : 'malwareContentVersion',
        'name'  : 'Malware Guard Model',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareContentVersion']
    },
    'malwareMgContentUpdated' : {
        'build' : buildDimension,
        'id'    : 'malwareMgContentUpdated',
        'name'  : 'Malware Guard Model Last Updated',
        'type'  : dsTypes.YEAR_MONTH_DAY_SECOND,
        'data'  : (entity) => fixDate(entity, 'malwareMgContentUpdated')
    },
    'malwareMgEngineVersion' : {
        'build' : buildDimension,
        'id'    : 'malwareMgEngineVersion',
        'name'  : 'Malware Guard Engine Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareMgEngineVersion']
    },
    'malwareMgCoreEngineVersion' : {
        'build' : buildDimension,
        'id'    : 'malwareMgCoreEngineVersion',
        'name'  : 'Malware Guard Core Engine Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareMgCoreEngineVersion']
    },
    'malwareProtectionStatus' : {
        'build' : buildDimension,
        'id'    : 'malwareProtectionStatus',
        'name'  : 'Malware Protection',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareProtectionStatus']
    },
    'malwareAVstatus' : {
        'build' : buildDimension,
        'id'    : 'malwareAVstatus',
        'name'  : 'Signature and Heuristic Detection',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareAVstatus']
    },
    'malwareAVQuarantineStatus' : {
        'build' : buildDimension,
        'id'    : 'malwareAVQuarantineStatus',
        'name'  : 'Signature and Heuristic Detection Quarantine',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareAVQuarantineStatus']
    },
    'malwareAvContentVersion' : {
        'build' : buildDimension,
        'id'    : 'malwareAvContentVersion',
        'name'  : 'Signature and Heuristic Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareAvContentVersion']
    },
    'malwareAvContentUpdated' : {
        'build' : buildDimension,
        'id'    : 'malwareAvContentUpdated',
        'name'  : 'AV Content Last Updated',
        'type'  : dsTypes.YEAR_MONTH_DAY_SECOND,
        'data'  : (entity) => fixDate(entity, 'malwareAvContentUpdated')
    },
    'malwareAvEngineVersion' : {
        'build' : buildDimension,
        'id'    : 'malwareAvEngineVersion',
        'name'  : 'AV Engine Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['malwareAvEngineVersion']
    },
    'quarantineActions' : {
        'build' : buildDimension,
        'id'    : 'quarantineActions',
        'name'  : 'Quarantine Actions',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['quarantineActions']
    },
    'fips' : {
        'build' : buildDimension,
        'id'    : 'fips',
        'name'  : 'FIPS',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['fips']
    },
    'proRemSvcStatus' : {
        'build' : buildDimension,
        'id'    : 'proRemSvcStatus',
        'name'  : 'ProRemSvcStatus',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['proRemSvcStatus']
    },
    'kernelServicesStatus' : {
        'build' : buildDimension,
        'id'    : 'kernelServicesStatus',
        'name'  : 'Kernel Services Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['kernelServicesStatus']
    },
    'machineName' : {
        'build' : buildDimension,
        'id'    : 'machineName',
        'name'  : 'Machine Name',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['machineName']
    },
    'uptime' : {
        'build' : buildDimension,
        'id'    : 'uptime',
        'name'  : 'Uptime',
        'type'  : dsTypes.DURATION,
        'data'  : (entity) => {
            const uptimeArray = entity['uptime']?.split(' ')
            if (uptimeArray === undefined) {
                return -1
            }
            return ((uptimeArray[0] * 86400) + (uptimeArray[2] * 3600) + (uptimeArray[4] * 60) + uptimeArray[6])
        }
    },
    'regOrg' : {
        'build' : buildDimension,
        'id'    : 'regOrg',
        'name'  : 'Registered Org',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['regOrg']
    },
    'regOwner' : {
        'build' : buildDimension,
        'id'    : 'regOwner',
        'name'  : 'Registered Owner',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['regOwner']
    },
    'platform' : {
        'build' : buildDimension,
        'id'    : 'platform',
        'name'  : 'Platform',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['platform']
    },
    'vmGuest' : {
        'build' : buildDimension,
        'id'    : 'vmGuest',
        'name'  : 'VM Guest',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => {
            return (entity['vmGuest'] === 'Yes' ? 'Virtual' : 'Physical')
        }
    },
    'virtualization' : {
        'build' : buildDimension,
        'id'    : 'virtualization',
        'name'  : 'Virtualization',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['virtualization']
    },
    'gmtoffset' : {
        'build' : buildDimension,
        'id'    : 'gmtoffset',
        'name'  : 'GMT Offset',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['gmtoffset']
    },
    'domain' : {
        'build' : buildDimension,
        'id'    : 'domain',
        'name'  : 'Domain',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['domain']
    },
    'primaryIpv4Address' : {
        'build' : buildDimension,
        'id'    : 'primaryIpv4Address',
        'name'  : 'Primary IPv4 Address',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['primaryIpv4Address']
    },
    'primaryIpAddress' : {
        'build' : buildDimension,
        'id'    : 'primaryIpAddress',
        'name'  : 'Primary IP Address',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['primaryIpAddress']
    },
    'mac' : {
        'build' : buildDimension,
        'id'    : 'mac',
        'name'  : 'MAC Address',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['mac']
    },
    'totalphysical' : {
        'build' : buildDimension,
        'id'    : 'totalphysical',
        'name'  : 'Total Store (GB)',
        'type'  : dsTypes.NUMBER,
        'data'  : (entity) => fixFloat(entity, 'totalphysical')
    },
    'availphysical' : {
        'build' : buildDimension,
        'id'    : 'availphysical',
        'name'  : 'Available Storage (GB)',
        'type'  : dsTypes.NUMBER,
        'data'  : (entity) => fixFloat(entity, 'availphysical')
    },
    'ExdPluginVersion' : {
        'build' : buildDimension,
        'id'    : 'ExdPluginVersion',
        'name'  : 'ExdPlugin Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['ExdPluginVersion']
    },
    'EndpointUIStatus' : {
        'build' : buildDimension,
        'id'    : 'EndpointUIStatus',
        'name'  : 'Endpoint UI Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['EndpointUIStatus']
    },
    'EndpointUIVersion' : {
        'build' : buildDimension,
        'id'    : 'EndpointUIVersion',
        'name'  : 'Endpoint UI Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['EndpointUIVersion']
    },
    'LogonTrackerStatus' : {
        'build' : buildDimension,
        'id'    : 'LogonTrackerStatus',
        'name'  : 'LogonTracker Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['LogonTrackerStatus']
    },
    'LogonTrackerVersion' : {
        'build' : buildDimension,
        'id'    : 'LogonTrackerVersion',
        'name'  : 'LogonTracker Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['LogonTrackerVersion']
    },
    'ProcessTrackerStatus' : {
        'build' : buildDimension,
        'id'    : 'ProcessTrackerStatus',
        'name'  : 'ProcessTracker Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['ProcessTrackerStatus']
    },
    'ProcessTrackerVersion' : {
        'build' : buildDimension,
        'id'    : 'ProcessTrackerVersion',
        'name'  : 'ProcessTracker Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['ProcessTrackerVersion']
    },
    'UACProtectStatus' : {
        'build' : buildDimension,
        'id'    : 'UACProtectStatus',
        'name'  : 'UACProtect Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['UACProtectStatus']
    },
    'UACProtectVersion' : {
        'build' : buildDimension,
        'id'    : 'UACProtectVersion',
        'name'  : 'UACProtect Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['UACProtectVersion']
    },
    'AmsiStatus' : {
        'build' : buildDimension,
        'id'    : 'AmsiStatus',
        'name'  : 'Amsi Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['AmsiStatus']
    },
    'AmsiVersion' : {
        'build' : buildDimension,
        'id'    : 'AmsiVersion',
        'name'  : 'Amsi Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['AmsiVersion']
    },
    'EventStreamerStatus' : {
        'build' : buildDimension,
        'id'    : 'EventStreamerStatus',
        'name'  : 'EventStreamer Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['EventStreamerStatus']
    },
    'EventStreamerVersion' : {
        'build' : buildDimension,
        'id'    : 'EventStreamerVersion',
        'name'  : 'EventStreamer Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['EventStreamerVersion']
    },
    'HostRemediationStatus' : {
        'build' : buildDimension,
        'id'    : 'HostRemediationStatus',
        'name'  : 'HostRemediation Status',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['HostRemediationStatus']
    },
    'HostRemediationVersion' : {
        'build' : buildDimension,
        'id'    : 'HostRemediationVersion',
        'name'  : 'HostRemediation Version',
        'type'  : dsTypes.TEXT,
        'data'  : (entity) => entity['HostRemediationVersion']
    }
}



function fixFloat(entity, num) {
    const replacedNum = entity[num]?.replace(/./g, '')

    const parsedNum = parseInt(entity[replacedNum])

    return isNaN(parsedNum) ? -1 : parsedNum
}

function fixDate(entity, date) {
    const parsedDate = entity[date]

    if (parsedDate !== undefined) {
        return entity[date]?.replace(/-/g, '').replace(/:/g, '').replace(/T/g, '').replace(/Z/g, '')
    }

    return parsedDate
}