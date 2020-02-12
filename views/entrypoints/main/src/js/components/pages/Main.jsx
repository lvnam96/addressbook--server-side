import React, { Profiler } from 'react';

import MainNav from '../MainNav/containers/MainNavContainer.jsx';
import MainContent from '../MainContent/containers/MainContentContainer.jsx';
import MainPageResolver from '../UrlResolver/MainResolver.jsx';

// const getProfilerCallback = () => {
//   let counter = 0;
//   return (
//     id, // the "id" prop of the Profiler tree that has just committed
//     phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
//     actualDuration, // time spent rendering the committed update
//     baseDuration, // estimated time to render the entire subtree without memoization
//     startTime, // when React began rendering this update
//     commitTime, // when React committed this update
//     interactions // the Set of interactions belonging to this update
//   ) => {
//     counter++;
//     console.log(id, phase, counter, interactions);
//   };
// };

const MainPage = () => (
  <>
    {/* <Profiler id="MainPageResolver" onRender={getProfilerCallback()}> */}
    <MainPageResolver />
    {/* </Profiler> */}
    {/* <Profiler id="MainContent" onRender={getProfilerCallback()}> */}
    <MainContent />
    {/* </Profiler> */}
    {/* <Profiler id="MainNav" onRender={getProfilerCallback()}> */}
    <MainNav />
    {/* </Profiler> */}
  </>
);

export default MainPage;
