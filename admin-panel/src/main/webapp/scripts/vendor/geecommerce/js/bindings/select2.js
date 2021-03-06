define([ 'knockout', 'gc/gc' ], function(ko, gc) {

	return {
		init: function(el, valueAccessor, allBindingsAccessor, viewModel) {
			ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
				$(el).select2('destroy');
			});

			var allBindings = allBindingsAccessor(),
				select2 = ko.utils.unwrapObservable(allBindings.select2);

			 $(el).select2(select2);
			  /*var obj = valueAccessor(),
				allBindings = allBindingsAccessor(),
				lookupKey = allBindings.lookupKey;
			$(element).select2(obj);
			if (lookupKey) {
				var value = ko.utils.unwrapObservable(allBindings.value);
				$(element).select2('data', ko.utils.arrayFirst(obj.data.results, function (item) {
					return item[lookupKey] === value;
				}));
			}

			ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
				$(element).select2('destroy');
			});*/
		},
		update: function (el, valueAccessor, allBindingsAccessor, viewModel) {
			var allBindings = allBindingsAccessor();

			if ("value" in allBindings) {

				if (allBindings.select2.multiple && allBindings.value().constructor != Array) {
					$(el).select2("val", allBindings.value().split(","));
				}
				else {
					$(el).select2("val", allBindings.value());
				}
			} else if ("selectedOptions" in allBindings) {
				var converted = [];
				var textAccessor = function(value) { return value; };
				if ("optionsText" in allBindings) {
					textAccessor = function(value) {
						var valueAccessor = function (item) { return item; }
						if ("optionsValue" in allBindings) {
							valueAccessor = function (item) { return item[allBindings.optionsValue]; }
						}
						var items = $.grep(allBindings.options(), function (e) { return valueAccessor(e) == value});
						if (items.length == 0 || items.length > 1) {
							return "UNKNOWN";
						}
						return items[0][allBindings.optionsText];
					}
				}
				$.each(allBindings.selectedOptions(), function (key, value) {
					converted.push({id: value, text: textAccessor(value)});
				});
				$(el).select2("data", converted);
			}
		}
	};
});
