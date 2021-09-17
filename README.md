## React-VideoCall
  
Video call to your friend without registering. 
Simply send your friend your auto-generated unique ID to make the call.  
Everytime you open a new tab, the server gives you a totally different unique ID.

### Development
```
# Install dependencies
yarn install

# Run server
yarn watch:server

# Run webpack-dev-server
yarn watch:client
```


### Deployment
```
# Install dependencies
yarn install

# Build front-end assets
yarn build

# Run server
yarn start
```

### TODO
- [ ] Button style on mobile device
- [ ] Select camera and audio device (reference [here](https://webrtc.github.io/samples/))
