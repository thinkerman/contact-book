
# Welcome to Contact App API!

[This Contact App API](https:ioschap.com) is hosted on a digital ocean server and was created with HAPI.js. The base url for the API is [api.ioschap.com](https://api.ioschap.com) and is also hosted on the same server.

The underlying database is postgres which is also hosted on the same server.

Below are the routes currently available, have fun!

# Routes

      routes: {
                /all: 'get all contacts',
                /contact: {
                    description: 'get single contacts',
                    params: Int : 'id'
                },
                /remove: {
                    description: 'delete single contact',
                    params: Int: 'id'
                },
                /add: {
                    description: 'add new contact',
                    params: {
                        fname: String : 'firstname',
                        lname: String : 'last name',
                        street: String :'street address',
                        p_code: String : 'postal code',
                        country: String : 'country name',
                        group: Enum : ['friend', 'professional', 'family', 'others'],
                        province: Enum : ['AB', 'NL', 'PE', 'NS', 'NB', 'QC', 'ON', 'MN', 'SK', 'BC', 'YT', 'NT', 'NU']
                    }
                },
                /search: {
                    description: 'search contact',
                    params: {
	                    fname :  String : 'firstname',
	                    lname : String : 'lname',
	                    group : Enum : ['friend', 'professional', 'family', 'others']
                    }
                },
                /update: {
                    description: 'update contact',
                    params: {
                        field: String : 'field to update',
                        value: String : 'new field value'
                    }
                }
            }
