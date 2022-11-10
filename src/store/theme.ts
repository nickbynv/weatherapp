import { makeAutoObservable } from "mobx"

class Theme {
    current: string = 'light'

    constructor() {
        makeAutoObservable(this)
    }

    switch() {
        this.current = (
            this.current === 'light' ? 'dark' : 'light'
        )
    }
}

export default new Theme()