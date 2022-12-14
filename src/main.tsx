import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  FormantProvider,
  Stack,
  TextField,
  Typography,
} from "@formant/ui-sdk";
import styled from "styled-components";
import { Authentication, Device, Fleet } from "@formant/data-sdk";
import { Universe } from "@formant/universe";
import * as uuid from "uuid";
import { LiveUniverseData } from "@formant/universe-connector";

function App({ deviceId }: { deviceId: string }) {
  return (
    <Universe
      initialSceneGraph={[
        {
          id: uuid.v4(),
          editing: false,
          type: "ground",
          name: "Ground",
          children: [],
          visible: true,
          position: { type: "manual", x: 0, y: 0, z: 0 },
          fieldValues: {
            flatAxes: {
              type: "boolean",
              value: true,
            },
          },
          data: {},
        },
        {
          id: uuid.v4(),
          editing: false,
          type: "device_visual_tf",
          name: "Grid Map",
          deviceContext: deviceId,
          children: [],
          visible: true,
          position: { type: "localization", stream: "map " },
          fieldValues: {},
          data: {},
          dataSources: [
            {
              id: "Transform tree only ID",
              sourceType: "telemetry",
              streamName: "tf",
              streamType: "transform tree",
            },
          ],
        },
        {
          id: uuid.v4(),
          editing: false,
          type: "grid_map",
          name: "Grid Map",
          deviceContext: deviceId,
          children: [],
          visible: true,
          position: { type: "localization", stream: "map " },
          fieldValues: {},
          data: {},
          dataSources: [
            {
              id: uuid.v4(),
              sourceType: "telemetry",
              streamName: "map ",
              streamType: "localization",
            },
          ],
        },
        {
          id: uuid.v4(),
          editing: false,
          type: "point_cloud",
          name: "PointCloud",
          deviceContext: deviceId,
          children: [],
          visible: true,
          position: { type: "localization", stream: "map " },
          fieldValues: {
            pointColor: {
              type: "number",
              value: 0xffffff,
            },
            pointSize: {
              type: "number",
              value: 5,
            },
            pointTexture: {
              type: "text",
              value:
                "https://formant-3d-models.s3.us-west-2.amazonaws.com/point.png",
            },
            pointAttenuate: {
              type: "boolean",
              value: false,
            },
          },
          data: {},
          dataSources: [
            {
              id: uuid.v4(),
              sourceType: "telemetry",
              streamName: "map ",
              streamType: "localization",
            },
          ],
        },
      ]}
      universeData={new LiveUniverseData()}
      mode="view"
      vr
    />
  );
}

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

function Login() {
  const [loggedIn, setLoggedIn] = React.useState(false); // false
  const [username, setUsername] = React.useState<string | undefined>(undefined);
  const [password, setPassword] = React.useState<string | undefined>(undefined);
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [deviceId, setDeviceId] = React.useState<string | undefined>(undefined);
  return loggedIn && deviceId ? (
    <App deviceId={deviceId} />
  ) : (
    <Centered>
      {loggedIn ? (
        <div>
          {devices.map((_) => (
            <Button
              key={_.id}
              variant="contained"
              size="small"
              type="button"
              onClick={async () => {
                setDeviceId(_.id);
              }}
            >
              {_.name}
            </Button>
          ))}
        </div>
      ) : (
        <Stack gap={3}>
          <Typography variant="h1">Login</Typography>
          <div>
            <TextField
              label="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <TextField
              label="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            variant="contained"
            size="large"
            type="button"
            onClick={async () => {
              if (username && password) {
                await Authentication.login(username, password);
                setLoggedIn(true);
                const devices = await Fleet.getDevices();
                setDevices(devices);
              }
            }}
          >
            Login
          </Button>
        </Stack>
      )}
    </Centered>
  );
}

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(
    <FormantProvider>
      <Login />
    </FormantProvider>
  );
}
