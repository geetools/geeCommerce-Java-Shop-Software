define([ 'durandal/app', 'durandal/composition', 'knockout', 'gc/gc',  'gc-attribute', 'gc-attribute/util'], function(app, composition, ko, gc, attrAPI, attrUtil) {
/*
	Widget can work in 2 modes
	1) inline
	2) modal

*/
    function AttributeValueVM(valueId, attributeId, backendLabel, code, code2, value, editable, enabled, inputType, frontendInput, isOptionAttribute, allowMultipleValues, i18n, options) {
        var self = this;
        self.valueId = valueId;
        self.attributeId = attributeId;
        self.backendLabel = backendLabel;
        self.code = code;
        self.code2 = code2;
        self.value = ko.observableArray(value);
        self.isEditable = editable;
        self.isEnabled = enabled;
        self.inputType = inputType;
        self.frontendInput = frontendInput;
        self.isOption = isOptionAttribute;
        self.isMultiple = allowMultipleValues;
        self.isI18n = i18n;
        self.options = options;
        self.hasChanged = false;
        // self.isShowField = true;

        // Callback for widget i18nEditor.
        self.unjsonDescriptionPanels = function(data) {
            var asJson = null;
            var asText = '';

            try
            {
                asJson = JSON.parse(data);
            }
            catch(e)
            {
                // exeption
            }

            if(asJson === null) {
                asText = data;
            } else {
                _.each(asJson, function(row) {
                    asText += row.title + row.body;
                });
            }

            return asText;
        };

        self.selectOptions = ko.computed(function() {

            var _options = [];
            _options.push( { id : '', text : function() {
                return gc.app.i18n('app:common.choose', {}, gc.app.currentLang);
            }});

            _.each(self.options, function(option) {
                if(!_.isUndefined(option.label)){
                    _options.push({id: option.id, text: option.label.i18n});
                }
            });

            return _options || [];
        });
    }


    function QueryNodeVM(parent, root){
        var self = this;

        self.root = root;
        self.type = ko.observable();
        self.operator = ko.observable();
        self.attrVal = ko.observable();
        self.attrCode = ko.observable();
        self.attrCode.subscribe(function (code) {
            var attr = _.findWhere(root.attributeValues(), { code : code });

            var attrOptions = attr.options;
            gc.ctxobj.enhance(attrOptions, [ 'label' ], 'any');

            var atr = new AttributeValueVM(
                undefined,
                attr.id,
                attr.backendLabel,
                attr.code,
                attr.code2,
                [],
                attr.editable,
                attr.enabled,
                attr.inputType,
                attr.frontendInput,
                attr.optionAttribute,
                attr.allowMultipleValues,// || true, // set all multiples
                attr.i18n,
                attrOptions);
            atr.isMultiple = true;
            atr.isShowField = true;
            self.attrVal(atr);

        });
        self.value = ko.observable();
        self.nodes = ko.observableArray([]);
        self.parent = ko.observable(parent);
      //  self.attributeValues = root.attributeValues;

        self.newNodeType = ko.observable();

        self.deleteNode = function(){
            self.parent().nodes.remove(self);
        };

        self.addSimpleNode = function (target, reason) {
            if( !(reason === 'nochange' || reason === 'save')) return;
            var nodeVM = new QueryNodeVM(self, self.root);
            nodeVM.type('ATTRIBUTE');
            self.nodes.push(nodeVM);
        }

        self.addNode = function(target, reason){
            if( !(reason === 'nochange' || reason === 'save')) return;

            var nodeVM = new QueryNodeVM(self, self.root);

            if(self.newNodeType() === 'BOOLEAN'){
                nodeVM.type('BOOLEAN');
                nodeVM.operator('AND');
            } else {
                nodeVM.type('ATTRIBUTE');

            }
            self.nodes.push(nodeVM);
        }

        self.convertNode = function () {
            var obj = {};
            obj["type"] = self.type();
            obj["operator"] = self.operator();
            if(self.attrVal()){
                var attr_obj = {}
                obj["val"] = attr_obj;
                if(self.attrVal().isOption){
                    attr_obj["opt_id"] = self.attrVal().value()
                } else {
                    attr_obj["val"] = self.attrVal().value()
                }
                attr_obj["attr_id"] = self.attrVal().attributeId;
            }
            if(self.nodes() && self.nodes().length > 0){
                var nodes = []

                _.each(self.nodes(), function (node) {
                    nodes.push(node.convertNode())
                })
                obj["nodes"] = nodes;
            }
            return obj;
        }
    }

	var ctor = function () {
		//this.isShowMediaAssets = ko.observable(false);
		//this.directories = ko.observableArray([]);
		//this.directory = ko.observable();
		this.displayMode = "inline";
		this.simpleQueryMode = true;
        this.showFilterButton = true;
        this.operatorChoice = ko.observableArray([{value:"AND", label:"All"}, {value:"OR", label:"Any"}]);
        this.nodeTypeChoice = ko.observableArray([{value:"BOOLEAN", label:"Condition Combination"}, {value:"ATTRIBUTE", label:"Attribute"}]);
        this.attributeValues = ko.observableArray([]);
        this.queryNode = ko.observable();

        this.ofTheseConditionsAreP1 = gc.app.i18n('app:modules.product-list.ofTheseConditionsAreP1');
        this.ofTheseConditionsAreP2 = gc.app.i18n('app:modules.product-list.ofTheseConditionsAreP2');
        this.ofTheseConditionsAreP3 = gc.app.i18n('app:modules.product-list.ofTheseConditionsAreP3');

        this.isShowQueryBuilder = ko.observable(false);
    };

	ctor.prototype.activate = function (settings) {
		var self = this;

		if(settings.displayMode){
            this.displayMode = settings.displayMode
        } else {
            this.displayMode = "inline";
        }

        if(settings.show){
            this.isShowQueryBuilder = settings.show;
            this.showFilterButton = false;
        }

        this.simpleQueryMode = ko.observable(true);
        this.operatorChoice = ko.observableArray([{value:"AND", label:"All"}, {value:"OR", label:"Any"}]);
        this.nodeTypeChoice = ko.observableArray([{value:"BOOLEAN", label:"Condition Combination"}, {value:"ATTRIBUTE", label:"Attribute"}]);
        this.attributeValues = ko.observableArray([]);
        this.queryNode = ko.observable();

        this.ofTheseConditionsAreP1 = gc.app.i18n('app:modules.product-list.ofTheseConditionsAreP1');
        this.ofTheseConditionsAreP2 = gc.app.i18n('app:modules.product-list.ofTheseConditionsAreP2');
        this.ofTheseConditionsAreP3 = gc.app.i18n('app:modules.product-list.ofTheseConditionsAreP3');

		this.settings = settings;

		if(settings.displayMode)
			this.displayMode = settings.displayMode;

        this.queryNode(setQueryNode(null, null, this.attributeValues));

        function setQueryNode( node, parent){
            if(node == null && parent != null)
                return null;
            else if(node == null){
                var nodeVM = new QueryNodeVM(parent, self);
                nodeVM.type('BOOLEAN');
                nodeVM.operator('AND');
                return nodeVM;
            }
            var nodeVM = new QueryNodeVM(parent, self);
            nodeVM.type(node.type);
            nodeVM.operator(node.operator);
            nodeVM.value(node.value);
            if(node.nodes && node.nodes.length > 0){
                node.nodes.each(function(elem, index) {
                    nodeVM.nodes.push(setQueryNode(elem, nodeVM));
                });
            }

            return nodeVM;
        }

        console.log("QUERY NODE")
        console.log(this.queryNode())

        return attrAPI.getAttributes( { fields : [ 'code', 'code2', 'backendLabel', 'editable', 'enabled', 'inputType', 'frontendInput', 'optionAttribute', 'allowMultipleValues', 'i18n', 'options', 'tags', 'label', 'includeInProductListQuery', 'group', 'includeInProductListFilter'] } ).then(function( response ) {

            var attributes = response.data.attributes;
            //   vm.attributes(attributes);
            var fAV = [];
            _.each(attributes, function(attr) {
                if(attr.includeInProductListQuery){
                    attr.label = gc.ctxobj.val(attr.backendLabel, gc.app.currentUserLang(), 'closest');
                    fAV.push(attr);
                }

            });
            self.attributeValues(fAV);
            setAttributeToNode(self.queryNode());
            function setAttributeToNode(nodeVM){
                if(nodeVM.value()){
                    var attr = _.findWhere(attributes, { id : nodeVM.value().attributeId });

                    var attrOptions = attr.options;
                    gc.ctxobj.enhance(attrOptions, [ 'label' ], 'any');

                    var atr = new AttributeValueVM(
                        nodeVM.value().id,
                        nodeVM.value().attributeId,
                        nodeVM.value().attribute.backendLabel,
                        nodeVM.value().attribute.code,
                        nodeVM.value().attribute.code2,
                        attr.optionAttribute ? nodeVM.value().optionIds : nodeVM.value().value,
                        attr.editable,
                        attr.enabled,
                        attr.inputType,
                        attr.frontendInput,
                        attr.optionAttribute,
                        attr.allowMultipleValues,// || true, // set all multiples
                        attr.i18n,
                        attrOptions);
                    atr.isMultiple = true;
                    atr.isShowField = true;
                    nodeVM.attrVal(atr);

                }
                if(nodeVM.nodes() && nodeVM.nodes().length > 0){
                    _.each(nodeVM.nodes(), function(node) {
                        setAttributeToNode(node);
                    });
                }
            }

        })


        /*		return mediaAssetAPI.getMediaAssetDirectories().then(
                    function (data) {
                        var dirs = mediaAssetUtil.toTree(data.data.mediaAssetDirectories, self);
                        self.directories(dirs);
                    });*/
	};

    ctor.prototype.apply = function () {
        var savedNode = this.queryNode().convertNode();
        this.settings.value(JSON.stringify(savedNode));
    }

    ctor.prototype.showQueryBuilder = function() {
        this.isShowQueryBuilder(true);
    };

    ctor.prototype.cancelQuery = function() {
        this.isShowQueryBuilder(false);
    };

    ctor.prototype.applyQuery = function() {
        this.apply();
        this.isShowQueryBuilder(false);
    };

	ctor.prototype.attached = function () {
		//jQuery('.media-assets-modal').appendTo("body");
/*		$('.media-assets-modal').draggable({
			handle: ".media-assets-modal-header"
		});*/
	};

	return ctor;
});