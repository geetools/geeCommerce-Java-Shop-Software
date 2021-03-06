define([ 'durandal/app', 'gc/childRouter', 'knockout', 'gc/gc' ],
	function(app, router, ko, gc) {

	var childRouter = router.createChildRouter().makeRelative({
		moduleId : 'modules/geecommerce/order/pages',
		fromParent : true
	}).mapModule([ {
		route : 'details/:id',
		moduleId : 'details/index',
	}, {
		route : 'details/tabs/base',
		moduleId : 'details/tabs/base',
	} ]);
	childRouter.buildNavigationModel();

	childRouter.setMetadata({
		pageTitle : gc.app.i18n('app:modules.order.title'),
		pageDescription : gc.app.i18n('app:modules.order.subtitle')
	});

	return {
		router : childRouter
	};
});