import { Animations } from "../views/widget"

export default interface UserSettingsType {
	animation?: keyof typeof Animations
}
