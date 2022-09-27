import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "./CommunityDetailModal";
import { ReactComponent as Edit } from "../assets/Edit.svg";
import forest1 from "../assets/forest_01.gif";
import forest2 from "../assets/forest_02.gif";
import forest3 from "../assets/forest_03.gif";
import forest4 from "../assets/forest_04.gif";
import forest5 from "../assets/forest_05.gif";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { __getCommunityDetail, __getCommunityCertify, errorReset } from "../redux/modules/communitySlice";
import { useInView } from "react-intersection-observer";
import { colors } from "../styles/color";
import { getCookie } from "../shared/cookie";
import LoginModal from "./Modals/LoginModal";
import { replace } from "lodash";
import NoMore from '../components/etc/NoMore';

import icons from "../assets";

const CommunityDetail = () => {
  const { CommunityNewProof } = icons;
  const navigate = useNavigate();
  const [modal, setModal] = React.useState(false);
  const param = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(__getCommunityDetail({ communityId: param.id }));
  }, [dispatch, param.id]);
  const { communityDetail, isLoading, certifyHasMore } = useSelector((state) => state.community);
  console.log(communityDetail);

  /* ------------------------------- 무한스크롤 기본셋팅 ------------------------------- */
  const { certify } = useSelector((state) => state.community);
  console.log(certify);
  console.log(certify.length);
  const [page, setPage] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    dispatch(__getCommunityCertify({ page, communityId: param.id })); /*인증글전체조회하려고*/
  }, [page, dispatch, param]);
  useEffect(() => {
    if (inView) {
      setPage((page) => page + 1);
    }
  }, [inView]);
  console.log("inView=>", inView);

  /* ----------------------------------- 로그인 ---------------------------------- */
  const [loginModal, setLoginModal] = useState(false);
  const loginModalOnOff = () => {
    setLoginModal(!loginModal);
  };

  const onInJoinBtn = () => {
    dispatch(errorReset());
    if (getCookie("mycookie") === undefined) {
      setLoginModal(!loginModal);
    } else {
      setModal(!modal);
    }
  };

  /* ------------------------------ 단계별 숲 이미지 띄우기 ----------------------------- */
  // const [forest, setForest] = useState();
  let gifUrl;
  if (communityDetail.successPercent <= 20) {
    gifUrl = forest1;
  } else if (Number(communityDetail.successPercent) > 21 && Number(communityDetail.successPercent) <= 40) {
    gifUrl = forest2;
  } else if (Number(communityDetail.successPercent) > 41 && Number(communityDetail.successPercent) <= 60) {
    gifUrl = forest3;
  } else if (Number(communityDetail.successPercent) > 61 && Number(communityDetail.successPercent) <= 80) {
    gifUrl = forest4;
  } else if (Number(communityDetail.successPercent) > 81) {
    gifUrl = forest5;
  }

  return (
    <>
      {loginModal && <LoginModal modalOnOff={loginModalOnOff} modal={loginModal}></LoginModal>}
      <CommunityDetailWrap>
        <Container>
          <Forest imgUrl={gifUrl}></Forest>
          <Content>
            <ContentItem font={"16px/22px 'Noto Sans KR', 'sans-serif'"} marginBottom={"10px"}>
              {communityDetail.startDate} - {communityDetail.endDate}
            </ContentItem>
            <ContentItem font={"700 26px/35px 'Noto Sans KR', 'sans-serif'"} marginBottom={"9px"}>
              {communityDetail.title}
            </ContentItem>
            <ContentItem font={"22px/30px 'Noto Sans KR', 'sans-serif'"} marginBottom={"35px"}>
              {communityDetail.content}
            </ContentItem>
            <ContentItem marginBottom={"35px"}> {communityDetail?.img !== null ? <img src={communityDetail?.img} alt="img" /> : null} </ContentItem>
          </Content>

          <StateBox>
            {communityDetail.dateStatus === "before" ? (
              !communityDetail.participant ? (
                <State>
                  <StateTop>
                    <StateItem font={"600 30px/40px 'Noto Sans KR', 'sans-serif'"}>모집중</StateItem>
                    <StateItem font={"600 60px/82px 'Noto Sans KR', 'sans-serif'"}> {communityDetail.participantsCnt} </StateItem>
                    <StateItem font={"24px/32px 'Noto Sans KR', 'sans-serif'"} color={"#9E9E9E"}>
                      / {communityDetail.limitParticipants}명
                    </StateItem>
                  </StateTop>
                  <StateBottom
                    onClick={() => {
                      onInJoinBtn();
                    }}
                  >
                    참여하기
                  </StateBottom>
                  {modal && <Modal closeModal={() => setModal(!modal)} communityId={param.id}></Modal>}
                </State>
              ) : (
                <OnGoingState>
                  <p>참가완료</p>
                  <p>곧 캠페인이 시작됩니다.</p>
                </OnGoingState>
              )
            ) : null}
            {communityDetail.dateStatus === "ongoing" ? (
              <EndState>
                <EndStateTop>
                  <EndStateItem position={"absolute"} top={"0"} left={"0"} font={"600 20px/1 'Noto Sans KR', 'sans-serif'"}>
                    달성률
                  </EndStateItem>
                  <EndStateItem font={"600 44px/1 'Noto Sans KR', 'sans-serif'"} textAlign={"right"}>
                    {communityDetail.successPercent}
                    <span>% </span>
                    <span> /100%</span>
                  </EndStateItem>
                </EndStateTop>
                <EndStateBottom>
                  <progress value={communityDetail.successPercent} max="100"></progress>
                </EndStateBottom>
              </EndState>
            ) : null}

            {communityDetail.dateStatus === "end" ? (
              <OnGoingState>
                <p>캠페인이 완료 되었습니다.</p>
              </OnGoingState>
            ) : null}
          </StateBox>


          <CertifyContentBox>
            <CertifyContent>
              {certify.map((v) => (
                <CertifyItem key={v.proofId} onClick={() => navigate(`/community/${param.id}/proof/${v.proofId}`)}>
                  <img src={v.img[0].imgUrl} alt="proofImg" />
                </CertifyItem>
              ))}
            </CertifyContent>
          </CertifyContentBox>

          {getCookie("mycookie") === undefined ? null : communityDetail.participant ? (
            communityDetail.dateStatus === 'ongoing' ? (
              <CertifyContentIcon onClick={() => navigate(`/community/${param.id}/proof/form`, { replace: true })}>
                <CommunityNewProof />
              </CertifyContentIcon>
            ) : null
          ) : null}

          {certify.length === 0 ? <NoMore txt={'아직 작성글이 없어요.'} /> : null}
          {certifyHasMore ? (isLoading ? null : <div ref={ref} style={{ border: "1px solid white" }}></div>) : null}

        </Container>
      </CommunityDetailWrap>
    </>
  );
};
export default CommunityDetail;

const CommunityDetailWrap = styled.div`
  width: 100%;
`;
const Container = styled.div`
  width: 100%;
`;
const Forest = styled.div`
  width: 100%;
  height: 466px;
  border-bottom-left-radius: 26px;
  border-bottom-right-radius: 26px;
  margin-bottom: 41px;
  background: url(${(props) => props.imgUrl}) no-repeat 50% 50%;
  background-size: cover;
`;

const Content = styled.div`
  width: 100%;
  padding: 0 17px;
  box-sizing: border-box;
  margin-bottom: 35px;
`;
const ContentItem = styled.div`
  width: 100%;
  font: ${(props) => props.font};
  margin-bottom: ${(props) => props.marginBottom};
  word-break: break-all;
  white-space: pre-line;
  img {
    width: 100%;
  }
`;

const StateBox = styled.div`
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  margin-bottom: 27px;
`;
const State = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ececec;
  border-radius: 15px;
`;
const StateTop = styled.div`
  text-align: center;
`;
const StateItem = styled.span`
  font: ${(props) => props.font};
  color: ${(props) => props.color};
`;
const StateBottom = styled.div`
  width: 100%;
  font: 18px/27px "Noto Sans KR", "sana-serif";
  text-align: center;
  padding: 11px 0;
  background-color: #424242;
  color: #fff;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

const OnGoingState = styled.div`
  width: 100%;
  border: 1px solid #ececec;
  padding: 35px 0;
  border-radius: 12px;
  p {
    font: 600 30px/40px "Noto Sans KR", "sans-serif";
    text-align: center;
  }
  p:nth-child(1) {
    color: #dddddd;
  }
  p:nth-child(2) {
    color: #202020;
  }
`;

const EndState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ececec;
  border-radius: 12px;
  padding: 25px 18px 4px 18px;
  box-sizing: border-box;
`;
const EndStateTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;

  position: relative;
  top: 0;
  left: 0;
`;
const EndStateItem = styled.div`
  width: 100%;
  position: ${(props) => props.position};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  font: ${(props) => props.font};
  color: ${(props) => props.color};
  text-align: ${(props) => props.textAlign};
  span:nth-of-type(1) {
    font-size: 30px;
    @media (max-width: 299px) {
      font-size: 18px;
    }
  }
  span:nth-of-type(2) {
    font: 18px/25px "Noto Sans KR", "sans-serif";
    color: #9e9e9e;
  }
`;
const EndStateBottom = styled.div`
  width: 100%;
  margin: 10px 0;

  progress {
    appearance: none;
    width: 100%;
    height: 20px;
  }
  progress::-webkit-progress-bar {
    background: transparent;
    border-radius: 10px;
    box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.2);
  }
  progress::-webkit-progress-value {
    border-radius: 10px;
    background: linear-gradient(to right, ${colors.green89}, ${colors.green28});
  }
`;
// const ProgressBar = styled.progress`
//   accent-color: #1c1c1c;
//   display: inline-block;
//   width: 100%;
//   height: 50px;
//   opacity: 0.4;
//   padding: 0;
//   margin: 0;
// `;






const CertifyContentBox = styled.div``;

const CertifyContent = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(auto-fill, minmax(33%, auto));
  gap: 1px;
  `;
const CertifyItem = styled.div`
  width: 100%;
  img {
    width: 100%;
    height: 100%;
  }
`;






const CertifyContentIcon = styled.div`
    position: absolute;
    bottom: 80px;
    right: 17px;
  
    display: flex;
    justify-content: center;
    align-items: center;
  `;