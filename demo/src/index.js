import React from "react";
import ReactDOM from "react-dom";

import { CMS, Inline, SubCMSContext, withSubCMSContext } from "../../build/index";
import contents from "./contents";

// Initialize CMS in the entry point of your application with the contents you already have
CMS.init(contents);

function Section({ code }) {
  return (
    <SubCMSContext code={code}>
      <h3>
        {/* Complete code for this element is "App.{code}.Title" */}
        <Inline code="Title">Example title</Inline>
      </h3>
      <p>
        {/* Complete code for this element is "App.{code}.Description" */}
        <Inline code="Description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Inline>
      </p>
    </SubCMSContext>
  );
}

// Export App wrapped with a <SubCMSContext code={<ComponentName>} />
const App = withSubCMSContext(
  function Main() {
    return (
      <React.Fragment>
        <h1>
          <Inline code="H1">🃏 This is a test App</Inline>
        </h1>
        <h2>
          <Inline code="H2">You can handle your contents with this CMS</Inline>
        </h2>

        <br />

        <Section code="Section1" />
        <Section code="Section2" />
        <Section code="Section3" />
      </React.Fragment>
    );
  },
  // This parameters is optional, if it is omitted will be taken the name of the component
  "App"
);

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
