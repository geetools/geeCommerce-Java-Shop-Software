define(['knockout', 'gc/gc'], function (ko, gc) {
	
	return {
        getPriceTypes: function() {
			self = this;

			var deferred = new $.Deferred();
			var promise = deferred.promise();

			promise.success = promise.done;
			promise.error = promise.fail;
			promise.complete = promise.done;

			gc.rest.get({
				url : '/api/v1/prices/types',
				sort : ['pos'],
				success : function(data, status, xhr) {
					if (self._onload) {
						self._onload(data, status, xhr);
					}

					deferred.resolve(data, status, xhr);
				},
				error : function(jqXHR, status, error) {
					if (self._onerror) {
						self._onerror(jqXHR, status, error);
					}

					deferred.reject(jqXHR, status, error);
				},
				complete : function(data, status, xhr) {
					if (self._oncomplete) {
						self._oncomplete(data, status, xhr);
					}

					deferred.resolve(data, status, xhr);
				}
			});

			return promise;
        }
    }
});