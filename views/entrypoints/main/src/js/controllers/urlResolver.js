// import memoizeOne from 'memoize-one';
import _isEmpty from 'lodash/isEmpty';
import reduxStore, { history } from '../redux/store';
import { replace, push } from 'connected-react-router';

// NOTE:
// There are 2 allowed ways to change URL on location bar
// 1. history.replace('/new/path');
// 2. reduxStore.dispatch(replace('/new/path'));
// => NOT using method (1) because directly replacing without dispatching will cause an error if the page is rendering at the same time this func is executed (ex: switchCbook() happens on app's very-first render), then <Route/> (from react-router-dom), which also listen to history's "location-changed" event, will start the re-rendering process WHILE THE APP HAS STARTED RENDERING ALREADY. Use method (2) instead:

let amountOfInstance = 0;

class UrlResolver {
  // singleton pattern (create only one instance during entire app's life time):
  constructor() {
    amountOfInstance++;
    if (amountOfInstance > 1) {
      return urlResolver;
    }
  }

  _unlistens = [];

  extract = (url = history.location) => {
    return {
      params: url.pathname.split('/').filter((param) => !_isEmpty(param)),
    };
  };

  onChange = (handleUrlChange) => {
    // there is another & suggested way using react-router to listen onChange event properly,
    // see https://github.com/ReactTraining/react-router/issues/3554#issuecomment-227119185
    const unlisten = history.listen(handleUrlChange);
    this._unlistens.push(unlisten);
  };

  init = () => {
    this.onChange((location, action) => {
      // location is an object like window.location
      console.log('LOCATION CHANGED: ', location, action, location.pathname, location.state);
      const loc = this.extract(location);
      this.params = loc.params;
    });
  };

  switchCbook = (cbookId) => {
    // history.replace(`/cbooks/${cbookId}`);
    // NOT using above method because directly replacing without dispatching will cause an error if the page is rendering at the same time this func is executed, then <Route/> (from react-router-dom), which also listen to history's "location-changed" event, will start the re-rendering process WHILE THE APP HAS STARTED RENDERING ALREADY. Use below method instead:
    reduxStore.dispatch(replace(`/cbooks/${cbookId}`));
  };

  end = () => {
    this._unlistens.forEach((unlisten) => {
      unlisten();
    });
  };
}

const urlResolver = new UrlResolver();

export default urlResolver;
