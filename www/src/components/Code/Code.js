import React from 'react';
import classNames from 'classnames';

import styles from './Code.module.scss';

const Code = ({size = '', ...props}) => {
	return (
		<pre
			className={classNames(styles.container, size ? `text-${size}` : '')}
			{...props}
		/>
	)
};

export default Code;
