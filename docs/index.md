# Angular CMF - resource library

The Symfony CMF has got several REST endpoint to fetch resources and work with them:

- [ContentBundle](https://github.com/symfony-cmf/ContentBundle) serves a REST controller to work on documents organized in by its routes
- [ResourcesRestBundle](https://github.com/symfony-cmf/ResourceRestBundle) provides the resources based on
the PHPCR tree

So this frontend library is able to work on both endpoints in a common way.

## Install

clone the repository into your repo (TODO: use bower)

```
git clone https://github.com/angular-cmf/resource.git 
```

go into the directory and run 

```
npm install
```

for the npm packages. And

```
bower install
```

for the frontend dependencies.

When installing with bower, this steps are done automatically.

## Configuration

### Set up the Persister

TBD. [#18](https://github.com/angular-cmf/resource/issues/18) and [#9](https://github.com/angular-cmf/resource/issues/9)
 
### Set up Base paths

TBD. with the persister settings.


## Usage

To use that library you will have to insert it into you frontend project like

``` html
 
<!-- some dependencies -->
<script type="application/javascript" src="lib/resource/bower_components/angular/angular.min.js"></script>
<script type="application/javascript" src="lib/resource/bower_components/angular-mocks/angular-mocks.js"></script>
<script type="application/javascript" src="lib/resource/bower_components/restangular/dist/restangular.min.js"></script>
<script type="application/javascript" src="lib/resource/bower_components/lodash/dist/lodash.min.js"></script>

<!-- use the lib -->
<script type="application/javascript" src="lib/angular-cmf/resource/dist/angularCmf.resource.min.js"></script>
```

and create an Angular Application

``` html

<!DOCTYPE html>
<html lang="en" ng-app="CMFapp">
<head>
    <meta charset="UTF-8">
    <title>Symfon CMF application</title>
</head>
<body>
    <div ng-controller="DocumentController as ctrl">
        <h1>{{ctrl.resource.title}}</h1>
        <p>{{ctrl.resource.body}}</p>
    </div>
    
    <script type="application/javascript" src="lib/angular-cmf/resource/dist/angularCmf.resource.min.js"></script>
    <script type="application/javascript">
        angular.module('CMFapp', ['angularCmf.resource'])
                .controller('DocumentController',['UnitOfWork', function (UnitOfWork) {
                    var vm = this;
                    vm.resource = {};
    
                    UnitOfWork.find('/foo').then(function (resource) {
                        vm.resource = resource;
                    });
                }]);
    </script>
</body>
</html>

```
 
## Find a resource

When fetching a resource from the API you can use the `UnitOfWork::find(id)` method. The resource will
 be cached in a local cache (not local storage) to be avoid the second call. 
 
``` javascript

UnitOfWork.find('/foo').then(function (resource) {
    vm.resource = resource;
});
 
``` 
 
As all method inside of the `UnitOfWork` the `find()` method will respond with a promise, caused by the asynchronous
API call. [Promises](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise) is an 
upcoming ES6 feature. `angular-cmf/resource` will provide an the same implementation angular is using: `$q`.
  
## Persist/Flush a resource
 
To persist a resource you have to call `UnitOfWork::persist(resource)` which again responds with a promise. The method
marks the resource as changed in the internal cache list, which no API call was done.
You have to run `UnitOfWork::flush()` to run POST/PUT requesst for all persisted resources. This handling is very
equal to a ORM called Doctrine.

``` javascript

angular.module('CMFapp', ['angularCmf.resource'])
    .controller('DocumentController',['UnitOfWork', function (UnitOfWork) {
        var vm = this;
        vm.resource = {};

        vm.save = function (id) {
            // does no second API call, when fetched before
            UnitOfWork.find('/foo').then(function (data) {
                UnitOfWork.persist(data).then(function () {
                    // the API call is done now
                    UnitOfWork.flush();
                })
            });
        }
    }]);
        
```

## Remove a resource

As in the case of `persist()` the method call `UnitOfWork::remove(resource);` has local effects only. That means
the resource will be flaged as removed. The `UnitOfWork::findAll()` won't return it anymore and a `UnitOfWork::flush()`
would call the DELETE request.

``` javascript
angular.module('CMFapp', ['angularCmf.resource'])
        .controller('DocumentController',['UnitOfWork', function (UnitOfWork) {
            var vm = this;
            vm.resource = {};

            vm.delete = function (id) {
                // does no second API call, when fetched before
                UnitOfWork.find('/foo').then(function (data) {
                    UnitOfWork.remove(data).then(function () {
                        // the API call is done now
                        UnitOfWork.flush();
                    })
                });
            }
        }]);
```


 
