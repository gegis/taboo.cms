import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'rsuite';

const ButtonLink = props => <Button componentClass={Link} {...props} />;

export default ButtonLink;
