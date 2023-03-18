/* import React, { ReactNode } from "react";
import { CSSTransition as ReactTransition } from "react-transition-group";

interface TransitionProps {
  in?: boolean;
  timeout: number;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  children: ReactNode;
}

function addClasses(classes: string[], ref: React.RefObject<HTMLDivElement>) {
  ref.current?.classList.add(...classes);
}

function removeClasses(classes: string[], ref: React.RefObject<HTMLDivElement>) {
  ref.current?.classList.remove(...classes);
}

export function Transition(props: TransitionProps) {
  const { enter, enterFrom, enterTo, leave, leaveFrom, leaveTo } = props;
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const enterClasses = splitClasses(enter);
  const enterFromClasses = splitClasses(enterFrom);
  const enterToClasses = splitClasses(enterTo);
  const leaveClasses = splitClasses(leave);
  const leaveFromClasses = splitClasses(leaveFrom);
  const leaveToClasses = splitClasses(leaveTo);

  return (
    <ReactTransition
      in={props.in}
      nodeRef={nodeRef}
      timeout={props.timeout}
      unmountOnExit
      onEnter={() => {
        addClasses([...enterClasses, ...enterFromClasses], nodeRef);
      }}
      onEntering={() => {
        removeClasses(enterFromClasses, nodeRef);
        addClasses(enterToClasses, nodeRef);
      }}
      onEntered={() => {
        removeClasses([...enterToClasses, ...enterClasses], nodeRef);
      }}
      onExit={() => {
        addClasses([...leaveClasses, ...leaveFromClasses], nodeRef);
      }}
      onExiting={() => {
        removeClasses(leaveFromClasses, nodeRef);
        addClasses(leaveToClasses, nodeRef);
      }}
      onExited={() => {
        removeClasses([...leaveToClasses, ...leaveClasses], nodeRef);
      }}
    >
      <div ref={nodeRef}>{props.children}</div>
    </ReactTransition>
  );
}

function splitClasses(string: string = ""): string[] {
  return string.split(" ").filter((s) => s.length);
} */


import { useEffect, useState } from "react";

type TransitionProps = {
  show: boolean;
  enter: string;
  enterFrom: string;
  enterTo: string;
  leave: string;
  leaveFrom: string;
  leaveTo: string;
  delay?: number;
  children: React.ReactNode;
};

const Transition: React.FC<TransitionProps> = ({
  show,
  enter,
  enterFrom,
  enterTo,
  leave,
  leaveFrom,
  leaveTo,
  delay = 0,
  children,
}) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      setTimeout(() => {
        setShouldRender(false);
      }, delay);
    }
  }, [show, delay]);

  const enterClasses = show ? enterTo : enterFrom;
  const leaveClasses = show ? leaveFrom : leaveTo;
  const generic = show ? enter : leave;

  return shouldRender ? (
    <div
      className={`${generic} ${enterFrom} ${enterClasses} ${leaveFrom} ${leaveClasses}`}
    >
      {children}
    </div>
  ) : null;
};

export default Transition;