// import React from 'react';

// const Spinner = () => (
//   <div className="spinner">
//     <div className="bounce1"></div>
//     <div className="bounce2"></div>
//     <div className="bounce3"></div>
//   </div>
// );

// export default Spinner;


import React from 'react';

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default Spinner;
