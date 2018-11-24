import React from "react";
import PropTypes from "prop-types";

/* 
  (for auto deducing CMS-code for components)
  Multiple encapsulated CMSContexts, return a code path for every cms entry.
  Example:
  <SubCMSContext code="test">
    ...
      <SubCMSContext code="subComponent"> 
          ...
            <CMSComponent code="component" /> 
            // auto deduced id for this cms' component: 
            // test.subComponent.component
          ...
      </SubCMSContext>
    ...    
  </SubCMSContext>
*/
export const CMSContext = React.createContext();

/* 
  this component define a sub cms context
  take props.children as a function.
  Usage:

  <SubCMSContext>
    <Component />
  </SubCMSContext>

  props <-- from higher level
*/

export function SubCMSContext(props) {
  const { code } = props;

  return (
    <CMSContext.Consumer>
      {value => (
        <CMSContext.Provider value={value ? `${value}.${code}` : code}>
          {props.children}
        </CMSContext.Provider>
      )}
    </CMSContext.Consumer>
  );
}

/* 
  this high-order component define a sub cms context

  this code:
    <SubCMSContext code="code">
      {(props) => {
        <Component {... props} />
      }}
    </SubCMSContext>

  is equivalent to:
    withSubCMSContext(Component, "code")
*/

export function withSubCMSContext(WrappedComponent, code) {
  const cmsSubCode = code ? code : WrappedComponent.name || "Component";

  function WithSubCMSContext(props) {
    return (
      <CMSContext.Consumer>
        {value => (
          <CMSContext.Provider
            value={value ? `${value}.${cmsSubCode}` : cmsSubCode}
          >
            <WrappedComponent {...props} />
          </CMSContext.Provider>
        )}
      </CMSContext.Consumer>
    );
  }

  WithSubCMSContext.displayName = `withSubCMSContext(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    "Component"})`;
  return WithSubCMSContext;
}
