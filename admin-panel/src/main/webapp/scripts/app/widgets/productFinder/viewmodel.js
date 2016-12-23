define([
        'durandal/app', 'durandal/composition', 'knockout', 'gc/gc', 'gc-product', 'gc-attribute', 'gc-attribute/util'
], function(app, composition, ko, gc, productAPI, attrAPI, attrUtil) {

    var ctor = function() {
        this.gc = gc;
        this.app = gc.app;
        this.pager = {};
        this.visible = ko.observable(false);
        this.showModalLink = true;
    };

    ctor.prototype.activate = function(settings) {
        var self = this;

        self.value = settings.value;
        self.currentlyCheckedValues = ko.observableArray([]);
        
        if(!_.isEmpty(settings.products)) {
            self.products = settings.products;
            self.productAs = settings.productAs || {};
            
            self.value.subscribe(function(newValue) {
                if(_.isEmpty(newValue)) {
                    self.products([]);
                } else {
                    productAPI.getProducts(newValue, self.productAs).then(function(response) {
                        self.products(response.data.products);
                    });
                }
            });
        }

        if (settings.visible) {
            self.visible = settings.visible;
        }

        if (settings.showModalLink) {
            self.showModalLink = settings.showModalLink;
        }

        // Pager columns
        var pagerColumns = [
                {
                    'name' : 'type',
                    'label' : 'app:modules.product.gridColType',
                    cookieKey : 't',
                    'selectOptions' : [
                            {
                                label : gc.app.i18n('app:common.choose'),
                                value : ''
                            }, {
                                label : gc.app.i18n('app:modules.product.typePRODUCT'),
                                value : 1
                            }, {
                                label : gc.app.i18n('app:modules.product.typeVARIANT_MASTER'),
                                value : 2
                            }, {
                                label : gc.app.i18n('app:modules.product.typePROGRAMME'),
                                value : 4
                            }
                    ]
                }, {
                    'name' : 'group',
                    combined : true,
                    'label' : 'app:modules.product.gridColGroup',
                    cookieKey : 'g'
                }, {
                    'name' : '$attr.ean',
                    'label' : 'app:modules.product.gridColEan',
                    cookieKey : 'ean'
                }, {
                    'name' : '$attr.article_number',
                    'label' : 'app:modules.product.gridColArticleNo',
                    cookieKey : 'an'
                }, {
                    'name' : '$attr.name',
                    'label' : 'app:modules.product.gridColName',
                    cookieKey : 'n'
                }
        ];

        // Init the pager.
        self.pager = new gc.Pager(productAPI.pagingOptions({
            columns : pagerColumns,
            multiContext : true,
            limit : 5,
            cookieName : 'pgr_products_fndr'
        }));
    };
    
    ctor.prototype.compositionComplete = function() {
        var self = this;
        self.pager.activateSubscribers();
    };

    ctor.prototype.attached = function(view, parent) {
        var self = this;
    };


    ctor.prototype.showProductFinder = function() {
        var self = this;
        self.visible(true);
    };
    
    ctor.prototype.cancelProductFinder = function() {
        var self = this;
        self.visible(false);
    };
    
    ctor.prototype.useCheckedProducts = function(model, event) {
        var self = this;
        self.value(self.currentlyCheckedValues());
    };

    ctor.prototype.useCheckedProductsAndClose = function(model, event) {
        var self = this;
        self.value(self.currentlyCheckedValues());
        self.visible(false);
    };
    
    return ctor;
});