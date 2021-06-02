import React, { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import classNames from "classnames"
import MetadataType from "../../models/Metadata"
import UserSettingsType from "../../models/UserSettings"

export const Animations = {
	backLeft: {
		in: "backInLeft",
		out: "backOutLeft"
	},
	backRight: {
		in: "backInRight",
		out: "backOutRight"
	},
	backUp: {
		in: "backInUp",
		out: "backOutDown"
	},
	backDown: {
		in: "backInDown",
		out: "backOutUp"
	},
	slideLeft: {
		in: "slideInLeft",
		out: "slideOutLeft"
	},
	slideRight: {
		in: "slideInRight",
		out: "slideOutRight"
	},
	slideUp: {
		in: "slideInUp",
		out: "slideOutDown"
	},
	slideDown: {
		in: "slideInDown",
		out: "slideOutUp"
	}
}

const Widget = () => {
	const { id } = useParams<{id: string}>()
	const [settings, setSettings] = useState<UserSettingsType>({})
	const [metadata, setMetadata] = useState<MetadataType>({})
	const [isPlaying, setIsPlaying] = useState<boolean>(false)
	const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true)

	const fetch = React.useCallback((index = 0) => {
		if (index > 0) {
			setIsFirstLoading(false)
		}

		axios.get(`/api/widget/${id}/json`)
			.then(({ data }) => {
				setSettings(data.settings)
				setMetadata(data.item)
				setIsPlaying(data.is_playing)
			})
			.finally(() => {
				setTimeout(() => fetch(index + 1), 2000)
			})
	}, [id])

	React.useEffect(() => {
		fetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const animation = React.useMemo(() => {
		let animation: keyof typeof Animations = "slideDown"

		if (settings && settings.animation && Object.keys(Animations).includes(settings.animation)) {
			animation = settings.animation
		}

		return Animations[animation]
	}, [settings])

	return (
		<>
			<div className="position-relative overflow-hidden" style={{ paddingBottom: "20%" }}>
				<div
					className={classNames("position-absolute absolute-fill d-flex animate__animated overflow-hidden bg-body", isPlaying ? `animate__${animation.in}` : `animate__${animation.out}`)}
					style={{
						animationDelay: isFirstLoading ? "-1s" : "0s"
					}}
				>
					<div
						className="d-inline-block square w-20"
						style={{
							backgroundRepeat: "no-repeat",
							backgroundSize: "100%",
							backgroundPosition: "center",
							backgroundImage: metadata && `url(${metadata.cover})`
						}}
					/>

					<div
						className="position-relative d-flex flex-column w-80"
					>
						<div className="d-inline-flex flex-column justify-content-around flex-grow-1 w-100 px-4 py-2">
							<div className="text-truncate" style={{ fontSize: "7vw", lineHeight: 1.2 }}>
								{metadata.title}
							</div>
							<div className="text-truncate font-weight-lighter" style={{ fontSize: "5vw", lineHeight: 1.2 }}>
								{metadata.artist}
							</div>
						</div>
						<div
							className="bg-primary"
							style={{
								height: 10,
								width: (metadata.progress && metadata.duration) && `${(100 * metadata.progress) / metadata.duration}%`
							}}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default Widget
