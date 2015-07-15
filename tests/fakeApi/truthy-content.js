var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource) {
        var test;
        (function (test) {
            var HttpContent = (function () {
                function HttpContent() {
                }
                HttpContent.truthy_content = {
                    "repository_alias": "phpcr_repo",
                    "repository_type": "doctrine_phpcr",
                    "payload_alias": null,
                    "payload_type": "nt:unstructured",
                    "path": "\/foo",
                    "repository_path": "\/foo",
                    "children": [],
                    "payload": {
                        "jcr:primaryType": "nt:unstructured",
                        "jcr:mixinTypes": [
                            "phpcr:managed"
                        ],
                        "phpcr:class": "Symfony\\Cmf\\Bundle\\ResourceRestBundle\\Tests\\Resources\\TestBundle\\Document\\Article",
                        "phpcr:classparents": [],
                        "title": "Article 1",
                        "body": "This is my article"
                    },
                    "_links": {
                        "self": {
                            "href": "\/api\/phpcr_repo\/foo"
                        }
                    }
                };
                return HttpContent;
            })();
            test.HttpContent = HttpContent;
        })(test = resource.test || (resource.test = {}));
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));
//# sourceMappingURL=truthy-content.js.map