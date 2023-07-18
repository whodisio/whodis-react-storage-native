import { EventStream } from 'event-stream-pubsub';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

import { WhodisAuthTokenStorage } from '../domain/WhodisAuthTokenStorage';

export const onSetEventStream = new EventStream<undefined>();
export const onGetEventStream = new EventStream<undefined>();

const key = 'authentication';

export const storage: WhodisAuthTokenStorage = {
  get: async () => {
    const token = await (async () => {
      const found = await getItemAsync(key);
      if (found === 'null') return null;
      return found;
    })();
    await onGetEventStream.publish(undefined);
    return token;
  },
  set: async (token: string | null) => {
    await setItemAsync(key, token ?? 'null');
    await onSetEventStream.publish(undefined);
  },
  on: {
    get: onGetEventStream,
    set: onSetEventStream,
  },
};
