## Synopsis
Buedchen-Client is a chrome application which loads the URL pushed from the server in fullscreen kiosk mode. The application can be run on chrome application or Chrome OS, it also disables device sleep mode.<br />
The Chrome application also has an admin interface and channels and providers interface.<br />
_Read the [buedchen-server](https://github.com/buedchen/buedchen-server) to get a better understanding of the application._
## Flow
As shown below once the application is launched, the admin interface pops up (for first time) where the user needs to set the server url, websocket url. Then the URL pushed from the server is loaded. It keeps displaying the contents of the URL pushed from the server, from where the user can navigate to admin interface or channels and providers interface.<br />

![Buedchen flow diagram](/images/flow_diagram.jpg?raw=true)

## Features

### Admin Interface
Below is the screenshot showing the admin interface. It allows the user to configure the Server URL, websocket URL and Client ID (server uses this ID to map the channel to client).<br />

![Admin Interface](/images/admin_interface.png?raw=true)

### Channels and Providers Interface
The channels and providers interface allows the user to configure providers and their associated dashboards. The user can then create channels and add contents to their channels from the providers.<br />

**Example: Providers interface:**
The below image shows the providers interface. The ‘Generic’ provider contains 2 dashboards in below example. The status for each dashboard indicates the availability of that dashboard, where a green smiley indicates that the dashboard is active and the red smiley indicates that the dashboard is down.<br />

![Providers Interface](/images/providers_interface.jpg?raw=true)

**Example: Channels interface:**
The below image shows a channel with 2 dashboards added from providers. Clicking ‘Add Dashboard’ lists out all the providers containing their associated dashboards which allows the user to specify the showtime for a dashboard and add it to the channel.<br />

![Channels Interface](/images/channels_interface.png?raw=true)

## Contributing
1. Fork it!
2. Create your feature branch: git checkout -b feature/my-new-feature
3. Commit your changes: git commit -am 'Added my-new-feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request

## License
Eclipse Public License - v 1.0

## Authors
* Tobias Ullrich
* Frank Wisniewski
* Pavan Manakatti

