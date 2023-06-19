import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import { withSetPropAction } from 'app/models/helpers/withSetPropAction'

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    user: types.frozen(),
    loginError: types.maybe(types.string),
    isLoading: false,
  })
  .views((self) => ({
    get isAuthenticated() {
      return !!self.user
    },
  }))
  .actions(withSetPropAction)
  .actions((self) => {
    const login = flow(function* login({ email, password }) {
      const auth = getAuth()
      try {
        self.isLoading = true
        self.loginError = undefined
        yield signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
        self.loginError = error.message
      } finally {
        self.isLoading = false
      }
    })

    const logout = flow(function* logout() {
      const auth = getAuth()
      try {
        yield signOut(auth)
        self.user = undefined
        self.loginError = undefined
      } catch (error) {
        // eh?
      }
    })

    return {
      logout,
      login,
    }
  })
  .actions((self) => {
    function afterCreate() {
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          self.setProp('user', user)
        } else {
          self.logout()
        }
      })
    }

    return {
      afterCreate,
    }
  })

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
