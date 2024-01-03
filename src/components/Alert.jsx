import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

const Alert = ({ content }) => {
  const { message, isVisible, type } = content;
  const ref = useRef(null)

  return (
    <CSSTransition
      in={isVisible}
      timeout={300} // Duration of the animation
      classNames="alert"
      unmountOnExit
      nodeRef={ref}
    >
      <div ref={ref} className={`alert alert__${type}`}>
        <div className="alert__content">
          {message}
        </div>
      </div>
    </CSSTransition>
  );
};

export default Alert;
