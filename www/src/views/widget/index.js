import React, {useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import classNames from 'classnames';
import {useSelector} from 'react-redux';

const Animations = {
	backLeft: {
		in: 'backInLeft',
		out: 'backOutLeft',
	},
	backRight: {
		in: 'backInRight',
		out: 'backOutRight',
	},
	backUp: {
		in: 'backInUp',
		out: 'backOutDown',
	},
	backDown: {
		in: 'backInDown',
		out: 'backOutUp',
	},
	slideLeft: {
		in: 'slideInLeft',
		out: 'slideOutLeft',
	},
	slideRight: {
		in: 'slideInRight',
		out: 'slideOutRight',
	},
	slideUp: {
		in: 'slideInUp',
		out: 'slideOutDown',
	},
	slideDown: {
		in: 'slideInDown',
		out: 'slideOutUp',
	},
};

const Widget = () => {
	const {id} = useParams();
	const [settings, setSettings] = useState({});
	const [item, setItem] = useState({});
	const [isPlaying, setIsPlaying] = useState(false);
	const [loading, setLoading] = useState(true);

	const fetch = React.useCallback(() => {
		axios.get(`/api/widget/${id}/json`)
			.then(({data}) => {
				setItem(data.item);
				setIsPlaying(data.is_playing);
				setSettings(data.settings);
				if (data.is_playing) {
					setLoading(false);
				}
			})
			.finally(() => {
				_.delay(fetch, 2000);
			});
	}, []);

	React.useEffect(() => {
		fetch();
	}, []);

	const animation = React.useMemo(() => _.get(settings, 'animation') || 'slideDown', [settings]);

	return (
		<>
			<div className="position-relative overflow-hidden" style={{paddingBottom: '20%'}}>
				<div
					className={classNames('position-absolute absolute-fill d-flex animate__animated overflow-hidden bg-dark', {
						[`animate__${Animations[animation].in}`]: isPlaying,
						[`animate__${Animations[animation].out}`]: !isPlaying,
					})}
					style={{
						animationDelay: loading && '-1s',
						borderRadius: 30,
					}}
				>
					<div
						className="d-inline-block square w-20"
						style={{
							backgroundRepeat: 'no-repeat',
							backgroundSize: '100%',
							backgroundPosition: 'center',
							backgroundImage: item && `url(${item.cover})`,
						}}
					/>

					<div
						className="position-relative d-flex flex-column w-80"
					>
						<div className="d-inline-flex flex-column justify-content-around flex-grow-1 w-100 px-4 py-2">
							<div className="text-truncate" style={{fontSize: '30vh', lineHeight: 1.2}}>
								{item.title}
							</div>
							<div className="text-truncate font-weight-lighter" style={{fontSize: '20vh', lineHeight: 1.2}}>
								{item.artist}
							</div>
						</div>
						<div
							className="bg-primary"
							style={{
								height: 10,
								width: `${(100*item.progress)/item.duration}%`,
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Widget;
