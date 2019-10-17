import React from "react";
import { Dimmer, Loader ,Segment} from "semantic-ui-react";

export default () => {
  return (
    <Segment inverted>
      <Dimmer active>
        <Loader inverted />
      </Dimmer>
    </Segment>
  );
};
