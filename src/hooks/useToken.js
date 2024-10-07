export const headers = () => {
return {
    "X-RhApiPlatform-CallContext": btoa(JSON.stringify({
        client: {
            serviceAccountId:"pat",
            roles: ['api_access_v2', 'insights_auth']
        }
    })),
    "X-RH-Identity": btoa(JSON.stringify({
        "identity": {
            "account_number": '941133',
            "user": {
                "username": 'rhn-it-lgreen',
                "user_id": '53552731'
            },
            "internal": {
                "org_id": '5394945'
            }
        }
    })),
    "X-RH-RBAC": btoa(JSON.stringify([
        { permission: 'subscriptions:products:read' },
        { permission: 'subscriptions:products:write' },
        { permission: 'config-manager:activation_keys:*' },
        { permission: 'subscriptions:organization:read' }
    ]))
  }
}
