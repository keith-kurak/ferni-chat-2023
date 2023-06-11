import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChannelStoreModel } from "./ChannelStore"
import { AuthenticationStoreModel } from "./AuthenticationStore" // @demo remove-current-line

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  channelStore: types.optional(ChannelStoreModel, {} as any),
  authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
