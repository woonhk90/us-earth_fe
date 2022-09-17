import React, { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { addDates, addDateLists } from "../../redux/modules/communityFormSlice";
import { ReactComponent as CalendarLeftArrow } from "../../assets/calendarLeftArrow.svg";
import { ReactComponent as CalendarRightArrowBk } from "../../assets/calendarRightArrowBk.svg";
import dayjs from "dayjs";

const CalendarModal = (props) => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const { dates } = useSelector((state) => state.communityForm);
  console.log(dates);
  console.log(props.beforDate);

  useEffect(() => {
    if (Object.values(dates).length) {
      console.log(dates);
      const list = Object.values(dates).map((val) => new Date(val));
      console.log(list);
      setDateRange(list);
    }
  }, []);

  const onChange = (dates) => {
    console.log("DATEPICKER ONCHANGE", dates);
    setDateRange(dates); // 배열
  };

  const date = {
    start: "",
    end: "",
  };

  for (let i = 0; i < 2; i++) {
    if (dateRange[i]) {
      const year = dateRange[i]?.getFullYear();
      const month = ("0" + (dateRange[i]?.getMonth() + 1)).slice(-2);
      const days = ("0" + dateRange[i]?.getDate()).slice(-2);
      const dateString = year + "-" + month + "-" + days;
      if (i === 0 ? (date.start = dateString) : (date.end = dateString));
      console.log(date);
    } else {
      date.start = "";
      date.end = "";
    }
  }

  const closeModal = () => {
    props.closeModal();
  };

  const addDateDispatch = () => {
    dispatch(addDates(date));
    props.closeModal();
  };
  // const datesss = date.start === date.end
  console.log(date.start === date.end);
  return (
    <ModalWrap onClick={closeModal}>
      <ModalBody
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <StInput>
          <DatePicker
            isdate={date.start === date.end}
            formatMonthDay="YYYY.MM"
            formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3).toUpperCase()}
            renderCustomHeader={({ monthDate, customHeaderCount, decreaseMonth, increaseMonth }) => {
              const month = monthDate.getMonth() + 1;
              const year = monthDate.getFullYear();
              return (
                <div>
                  <button
                    className={"react-datepicker__navigation react-datepicker__navigation--previous"}
                    style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
                    onClick={decreaseMonth}
                  >
                    <span className={"react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"}>
                      <CalendarRightArrowBk />
                    </span>
                  </button>
                  <span className="react-datepicker__current-month">
                    {year}.{month}
                  </span>
                  <button
                    className={"react-datepicker__navigation react-datepicker__navigation--next"}
                    style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
                    onClick={increaseMonth}
                  >
                    <span className={"react-datepicker__navigation-icon react-datepicker__navigation-icon--next"}>
                      <CalendarRightArrowBk />
                    </span>
                  </button>
                </div>
              );
            }}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={onChange}
            selectsRange
            selectsDisabledDaysInRange
            inline
            disabledKeyboardNavigation
          />
        </StInput>
        {date.start.length > 0 && date.end.length > 0 ? (
          <FooterMenus color={"#FFFFFF"} onClick={addDateDispatch} bgColor={"#353535"}>
            {dayjs(date.start).format("YY.MM.DD")} - {dayjs(date.end).format("YY.MM.DD")} / 선택완료
          </FooterMenus>
        ) : (
          <FooterMenus color={"#BEBEBE"} bgColor={"#EDEDED"}>
            기간을 선택해 주세요
          </FooterMenus>
        )}
      </ModalBody>
    </ModalWrap>
  );
};

export default CalendarModal;
const ModalWrap = styled.div`
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalBody = styled.div``;

const StInput = styled.div`
  width: 100%;
  bottom: 56px;
  left: 0;
  position: absolute;
  .react-datepicker__header {
    padding: 30px 0 8px 0;
    background-color: #ffffff;
    border: none;
    border-radius: 20px 20px 0 0 !important;
  }
  .react-datepicker {
    border-radius: 20px 20px 0 0 !important;
  }
  .react-datepicker__month-container {
    float: none;
    margin-bottom: 25px;
  }
  .react-datepicker__current-month {
    font-size: 24px !important;
  }
  .react-datepicker__day-names,
  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
  }
  .react-datepicker__day-names {
    color: #000000;
    opacity: 0.5;
  }

  .react-datepicker__day--selected {
    border-radius: 50%;
    background-color: #353535;
  }

  .react-datepicker__day,
  .react-datepicker__day--selected,
  .react-datepicker__day--weekend {
    :hover {
      border-radius: 50%;
    }
    border: none;
  }
  .react-datepicker__day-names,
  .react-datepicker__month {
    margin: 0 17px;
  }
  .react-datepicker__day {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .react-datepicker__day-name {
    margin-top: 20px;
    width: 100%;
  }
  .react-datepicker__day--disabled {
    color: #000000;
    opacity: 0.5;
  }
  .react-datepicker__day,
  .react-datepicker__time-name {
    width: 100%;
    aspect-ratio: 1/1;
    margin: 3px 0;
    border: none;
  }
  .react-datepicker {
    justify-content: start;
    align-items: flex-end;
    width: 100%;
    position: absolute;
    z-index: 1;
    left: 0px;
    bottom: 0;
    border: none;
  }
  .react-datepicker__current-month {
    font-size: 16px;
  }
  .react-datepicker__day--in-range {
    color: black;
    border-radius: 0;
    background-color: #ededed;
    border: none;
  }
  .react-datepicker__day--in-selecting-range {
    border-radius: 50%;
    background-color: #353535;
    border: none;
  }
  .react-datepicker__day {
    border: none;
    font-size: 18px;
  }
  .react-datepicker__navigation {
    top: 30px;
    margin: 0 20px;
  }
  .react-datepicker__day--in-range {
    :hover {
      border-radius: 0%;
    }
    position: relative;
  }
  .react-datepicker__day--range-start {
    border-radius: 50%;
    background-color: #353535;
    color: #ffffff;
    :hover {
      border-radius: 50%;
    }
    ::after {
      content: "";
      z-index: -1;
      background-color: #ededed;
      width: 50%;
      border-radius: 0;
      height: 100%;
      position: absolute;
      right: 0;
    }
  }
  .react-datepicker__day--range-end {
    border-radius: 50%;
    background-color: #353535;
    color: #ffffff;
    ::after {
      content: "";
      z-index: -1;
      background-color: ${(props) => (props.children.props.isdate ? "transparent" : "#EDEDED")};
      width: 50%;
      border-radius: 0;
      height: 100%;
      position: absolute;
      left: 0;
    }
    :hover {
      border-radius: 50%;
    }
  }
`;

//bottom
const FooterMenus = styled.button`
  width: 100%;
  height: 56px;
  line-height: 48px;
  bottom: 0;
  left: 0;
  border: none;
  position: absolute;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bgColor};
`;