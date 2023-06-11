import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ChannelModel } from 'app/models/Channel'
import { sortBy } from 'lodash'
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
  addDoc,
} from "firebase/firestore";

/**
 * Model description here for TypeScript hints.
 */
export const ChannelStoreModel = types
  .model("ChannelStore")
  .props({
    channels: types.array(ChannelModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get channelsForList() {
      return sortBy(self.channels.slice(), c => c.name.toLowerCase());
    },
  }))
  .actions((self) => ({
    updateChannels(querySnapshot) {
      self.channels.clear();
      querySnapshot.forEach((doc) => {
        self.channels.push({ id: doc.id, name: doc.data().name });
      });
    }
  }))
  .actions((self) => {
    let unsubscribeFromFirebaseStream;
    function afterAttach() {
      const db = getFirestore();
      const q = query(collection(db, "channels"));
      unsubscribeFromFirebaseStream = onSnapshot(q, (querySnapshot) => {
        self.updateChannels(querySnapshot);
      });
    }

    function beforeDestroy() {
      unsubscribeFromFirebaseStream && unsubscribeFromFirebaseStream();
    }

    const addChannel = flow(function* addChannel(name) {
      const db = getFirestore();
      // add new document with auto-id
      yield addDoc(collection(db, "channels"), {
        name
      });
    });

    return {
      afterAttach,
      beforeDestroy,
      addChannel,
    }
  })

export interface ChannelStore extends Instance<typeof ChannelStoreModel> {}
export interface ChannelStoreSnapshotOut extends SnapshotOut<typeof ChannelStoreModel> {}
export interface ChannelStoreSnapshotIn extends SnapshotIn<typeof ChannelStoreModel> {}
export const createChannelStoreDefaultModel = () => types.optional(ChannelStoreModel, {})
