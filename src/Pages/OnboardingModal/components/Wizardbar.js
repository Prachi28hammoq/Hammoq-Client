import React from "react";
import {Button} from "react-bootstrap"
import "./Wizardbar.css";
import Carousel from "./Carousel";

const Wizardbar = (props) => {


   const BackButton = () => {
    return (
      <Button
        variant="secondary"
        className='onboarding_modal_back_button'
        onClick={() =>
          props.selectedDot > 0
            ? props.setSelectedDot((selectedDot) => selectedDot - 1)
            : null
        }
      >
        Back
      </Button>

    )
  }
  const NextButton = () => {
    return (
      <Button
        variant="primary"
        className='onboarding_modal_next_button'
        disabled={props.modal0InValid}
        onClick={() =>
          props.selectedDot < props.numberOfDots - 1
            ? props.setSelectedDot((selectedDot) => selectedDot + 1)
            : null
        }
      >
        Next
      </Button>
    )
  }
  const SubmitButton = () => {
    return (
      <Button
        variant="primary"
        className='onboarding_modal_next_button'
        disabled={props.modal0InValid}
        onClick={() =>{
                props.setSubmit(true);
                return props.selectedDot < props.numberOfDots - 1
                ? props.setSelectedDot((selectedDot) => selectedDot + 1)
                : null
          }
        }
      >
        Submit
      </Button>
    )
  }
  return (
    <div className='onboarding_wizard_bar'>
      <Carousel
        numberOfDots={props.numberOfDots}
        selectedDot={props.selectedDot}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",

          //   border: "1px solid violet",
        }}
      >
        <div className='onboarding_buttons'>

          {props.selectedDot > 0 ? <BackButton /> : null}
          {props.selectedDot == 3 ? <SubmitButton/> : <NextButton />}


        </div>
      </div>
    </div>
  );
};

export default Wizardbar;
