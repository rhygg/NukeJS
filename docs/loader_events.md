# EventLoaders
EventLoaders take care of loading, handling and parsing events. Without them, your Bot couldn't handle Events!

EventLoaders give you the opportunity to differ between events, you can have events only run in debug, by simply commenting out all the other Loaders and so on!

## Initialization
A basic EventLoader would be
```js
const normalEvents = new nukejs.EventLoader(client, {directory: "./events"});
```

## Parameter

Option | Input | Function | default
------------ | ------------- | ------------- | -------------
directory | string | Sets the Event directory, of where all the events are located | none
