# React component of Google Map with three modes to use

## Main usage modes:

* Displaying marker mode

The simplest mode to show one address.

![One place mode](./screenshots/one_place.png)

* Drawing mode

Mode is used for selecting several areas on map. User clicks once specifying a center of area and clicks twice to determine a radius of circle.
Then user can click right mouse button to remove the particular circle.
In hand mode on map user can change a center and radius of created circles.

![Drawing mode](./screenshots/drawing.png)

* Displaying circles mode

Mode is used as read-only map with list of existing circles.

![Circles mode](./screenshots/circles.png)

## Usage:

```
import GoogleMap from './components/GoogleMap';
import {MapMode} from '../constants'

const {places} = this.state;
<GoogleMap
  mapMode={MapMode.CIRCLES}
  places={places}
  center={places && places[0] && places[0].center}
  rootStyles={{flex: '1 0 auto'}}
/>
```
Where:

* `mapMode` is value from constants
* `places` is list of objects like:
```
{
  center: {lat: 50.4938, lng: 30.4568}
  id: 14
  radius: 3461.82
}
```
