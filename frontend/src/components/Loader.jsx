import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="cup">
          <div className="cup-handle" />
          <div className="smoke one" />
          <div className="smoke two" />
          <div className="smoke three" />
        </div>
        <div className="load">Loading...</div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    width: 100px;
    height: 100px;
    position: relative;
    animation: shake 3s infinite ease-in-out;
  }

  .cup {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 30px;
    background-color: #5b4022cb;
    border: 1px solid #2e2e2e;
    border-radius: 3px 3px 10px 10px;
    z-index: 1;
    animation: cupPulse 6s infinite ease-in-out;
  }

  .cup::before {
    content: "";
    position: absolute;
    bottom: -5px;
    width: calc(100% - 2px);
    height: 6px;
    background: #5b4022cb;
    border: 1px solid #2e2e2e;
    border-top: none;
    border-radius: 50%;
    z-index: -1;
    animation: cupPulse 6s infinite ease-in-out;
  }

  .cup::after {
    content: "";
    position: absolute;
    top: -2px;
    left: 1px;
    width: calc(100% - 2px);
    height: 4px;
    background: #da8920ca;
    border: 1px solid #2e2e2e;
    border-radius: 50%;
    animation: coffeeGlow 6s infinite ease-in-out;
  }

  .cup-handle {
    position: absolute;
    top: 5px;
    right: -10px;
    width: 10px;
    height: 15px;
    border: 2px solid #2e2e2e;
    border-left: none;
    border-radius: 0 10px 10px 0;
    background: transparent;
  }

  .smoke {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 10px;
    height: 25px;
    background: rgba(72, 67, 67, 0.501);
    border-radius: 50%;
    transform: translateX(-50%);
    animation: rise 3s infinite ease-in-out;
    filter: blur(8px);
  }

  .smoke.one {
    animation-delay: 0s;
  }
  .smoke.two {
    animation-delay: 0.8s;
  }
  .smoke.three {
    animation-delay: 1.6s;
  }

  .load {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #2e2e2e;
    opacity: 0.6;
  }

  @keyframes rise {
    0% {
      transform: translate(-50%, 0) scale(0.4);
      opacity: 0;
    }
    30% {
      opacity: 0.7;
    }
    60% {
      opacity: 0.4;
    }
    100% {
      transform: translate(-50%, -120px) scale(1);
      opacity: 0;
    }
  }

  @keyframes shake {
    0% {
      transform: translateX(0) translateY(0) rotate(0);
    }
    25% {
      transform: translateX(-4px) translateY(-2px) rotate(-2deg);
    }
    50% {
      transform: translateX(0) translateY(0) rotate(0);
    }
    75% {
      transform: translateX(4px) translateY(-2px) rotate(2deg);
    }
    100% {
      transform: translateX(0) translateY(0) rotate(0);
    }
  }

  /* New Animations */
  @keyframes cupPulse {
    0%,
    100% {
      background-color: #5b4022cb;
    }
    50% {
      background-color: #f5f5f5bd;
    }
  }

  @keyframes coffeeGlow {
    0%,
    100% {
      background: #da8920ca;
    }
    50% {
      background: #fed197d5;
    }
  }
`;

export default Loader;
