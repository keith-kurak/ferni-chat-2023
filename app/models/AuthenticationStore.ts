import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"

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

    const setUser = (user) => {
      self.user = user
    }

    return {
      logout,
      login,
      setUser,
    }
  })
  .actions((self) => {
    function afterCreate() {
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          self.setUser(user)
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
