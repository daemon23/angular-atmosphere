angular.module('angular.atmosphere', [])
    .service('atmosphereService', function($rootScope){
        var wrap = function(origin, value, key) {
            if (typeof value !== 'function')
                return value;
            switch (key) {
                case 'onTransportFailure':
                    return function (errorMessage, request) {
                        $rootScope.$apply(function(){ origin.onTransportFailure(errorMessage, request); });
                    }
                case 'onReconnect':
                    return function (request, response) {
                        $rootScope.$apply(function(){ origin.onReconnect(request, response); });
                    }
                case 'onOpen':
                case 'onReopen':
                case 'onClose':
                case 'onMessage':
                case 'onClientTimeout':
                case 'onError':
                    return function(response) {
                        $rootScope.$apply(function(){ origin[key](response); });
                    }
                default:
                    return value;
            }
        }

        return {
            subscribe: function(request){
                var result = {};
                angular.forEach(request, function(value, property){
                    result[property] = wrap(request, value, property);
                });

                return atmosphere.subscribe(result);
            }
        };
});
