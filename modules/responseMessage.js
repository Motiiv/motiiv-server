module.exports = {
  NULL_VALUE: "필요한 값이 없습니다",
  OUT_OF_VALUE: "파라미터 값이 잘못되었습니다",
  NO_AUTHORITY: "권한이 없습니다",

  // 로그인
  LOGIN_SUCCESS: "로그인 성공",
  LOGIN_FAIL: "로그인 실패",
  NO_USER: "존재하지 않는 회원입니다.",
  MISS_MATCH_PW: "비밀번호가 맞지 않습니다.",
  LOGIN_REQUIRED: "로그인이 필요합니다",
  PROCEED_WITH_SIGNUP:
    "해당 snsId와 socialType를 가진 유저가 없습니다. 회원가입을 진행해 주세요",
  LOGOUT_SUCCESS: "유저 로그아웃 성공",

  // 인증
  EMPTY_TOKEN: "토큰 값이 없습니다.",
  EXPIRED_TOKEN: "토큰 값이 만료되었습니다.",
  INVALID_TOKEN: "유효하지 않은 토큰값입니다.",
  AUTH_SUCCESS: "인증에 성공했습니다.",
  ISSUE_SUCCESS: "새로운 토큰이 생성되었습니다.",

  DB_ERROR: "DB 오류",

  // 유저
  CREATE_USER_SUCCESS: "유저 생성 성공",
  ALREADY_USER: "이미 있는 유저입니다",
  CREATE_USER_FAIL: "유저 생성 실패",
  GET_ALL_USERS_SUCCESS: "모든 유저 조회 성공",
  GET_ALL_USERS_FAIL: "모든 유저 조회 실패",
  GET_ONE_USER_SUCCESS: "유저 조회 성공",
  GET_ONE_USER_FAIL: "유저 조회 실패",
  GET_USER_PROFILE_SUCCESS: "유저 프로필 조회 성공",
  UPDATE_USER_SUCCESS: "유저 수정 성공",
  DELETE_USER_SUCCESS: "유저 삭제 성공",
  DELETE_USER_FAIL: "해당 아이디를 가진 유저가 없습니다.",
  SELECT_JOB_AND_KEYWORDS_SUCCESS: "직군과 관심사 추가 성공",
  NO_SUCH_KEYWORD: "해당 관심사가 없습니다",
  NO_SUCH_JOB: "해당 직군이 없습니다",
  ALREADY_ADDED_KEYWORD: "이미 추가된 관심사입니다.",

  // 워크스페이스
  CREATE_WORKSPACE_SUCCESS: "워크스페이스 생성 성공",
  GET_ONE_WORKSPACE_SUCCESS: "워크스페이스 조회 성공",
  GET_ONE_WORKSPACE_FAIL: "워크스페이스 조회 실패",
  GET_ALL_WORKSPACES_SUCCESS: "해당 유저의 모든 워크스페이스 조회 성공",
  UPDATE_WORKSPACE_SUCCESS: "워크스페이스 수정 성공",
  DELETE_WORKSPACE_SUCCESS: "워크스페이스 삭제 성공",
  INVALID_URL: "URL 값이 잘못되었습니다.",

  // 관리자
  NOT_ADMIN: "관리자가 아닙니다.",
  SAME_ADMIN_USERNAME_AS_BEFORE: "기존 이름과 동일합니다",
  ALREADY_USERNAME_ADMIN: "해당 이름을 가진 관리자가 존재합니다.",
  CREATE_ADMIN_SUCCESS: "관리자 생성 성공",
  CREATE_ADMIN_FAIL: "관리자 생성 실패",
  LOGIN_ADMIN_SUCCESS: "관리자 로그인 성공",
  LOGIN_ADMIN_FAIL_PASSWORD: "관리자 비밀번호가 잘못되었습니다",
  LOGOUT_ADMIN_SUCCESS: "관리자 로그아웃 성공",
  GET_ALL_ADMINS_SUCCESS: "모든 관리자 조회 성공",
  GET_ALL_ADMINS_FAIL: "모든 관리자 조회 실패",
  GET_ONE_ADMIN_SUCCESS: "관리자 조회 성공",
  GET_ONE_ADMIN_FAIL: "관리자 조회 실패",
  DELETE_ADMIN_SUCCESS: "관리자 삭제 성공",
  UPDATE_ADMIN_USERNAME_SUCCESS: "관리자 이름 변경 성공",
  UPDATE_ADMIN_PASSWORD_SUCCESS: "관리자 비밀번호 변경 성공",
  DELETE_ADMIN_FAIL: "해당 아이디를 가진 관리자가 없습니다.",

  // 섹션
  CREATE_SECTION_SUCCESS: "섹션 생성 성공",
  ALREADY_SECTION: "이미 있는 섹션입니다",
  CREATE_SECTION_FAIL: "섹션 생성 실패",
  GET_ALL_SECTIONS_SUCCESS: "모든 섹션 조회 성공",
  GET_ALL_SECTIONS_FAIL: "모든 섹션 조회 실패",
  GET_ONE_SECTION_SUCCESS: "섹션 조회 성공",
  GET_ONE_SECTION_FAIL: "섹션 조회 실패",
  UPDATE_SECTION_SUCCESS: "섹션 수정 성공",
  SAME_SECTION_TITLE: "기존 제목과 동일합니다.",
  ALREADY_SECTION_TITLE: "해당 제목을 가진 섹션이 존재합니다",
  DELETE_SECTION_SUCCESS: "섹션 삭제 성공",
  DELETE_SECTION_FAIL: "섹션 삭제 실패",

  // 섹션 & 비디오
  GET_ONE_VIDEO_FAIL: "동영상 조회 실패",
  ADD_VIDEO_TO_SECTION_SUCCESS: "해당 섹션에 해당 영상 추가 성공",
  REMOVE_VIDEO_FROM_SECTION_SUCCESS: "해당 섹션에서 해당 영상 제거 성공",
  GET_VIDEOS_OF_SECTION_SUCCESS: "해당 섹션의 영상 조회 성공",
  DUPLICATE_VIDEO_IN_THE_SECTION: "이 섹션에 해당 영상이 이미 있습니다",
  NO_SUCH_VIDEO_IN_THE_SECTION: "이 섹션에 해당 영상이 없습니다",

  /* 토큰 */
  EMPTY_TOKEN: "토큰 값이 없습니다.",
  EXPIRED_TOKEN: "토큰 값이 만료되었습니다.",
  INVALID_TOKEN: "유효하지 않은 토큰값입니다.",
  AUTH_SUCCESS: "인증에 성공했습니다.",
  ISSUE_SUCCESS: "새로운 토큰이 생성되었습니다.",

  /* 서버에러 */
  INTERNAL_SERVER_ERROR: "서버 내부 오류",

  /* Video_main */
  GET_ALL_POST_SUCCESS: "비디오 불러오기 성공",
  GET_ALL_POST_FAIL: "비디오 불러오기 실패",

  /* Video_detail */
  GET_VIDEO_DETAIL_SUCCESS: "비디오 상세 불러오기 성공",
  GET_VIDEO_DETAIL_FAIL: "비디오 상세불러오기 실패",

  /* 좋아요 */
  POST_VIDEO_LIKE_SUCCESS: "댓글 좋아요 성공",
  POST_VIDEO_LIKE_FAIL: "댓글 좋아요 실패",
  DELETE_VIDEO_LIKE_SUCCESS: "댓글 좋아요 취소 성공",
  DELETE_VIDEO_LIKE_FAIL: "댓글 좋아요 실패",

  /* 비디오 저장 */
  POST_VIDEO_SAVE_SUCCESS: "비디오 저장 성공",
  POST_VIDEO_SAVE_FAIL: "비디오 저장 실패",
  DELETE_VIDEO_SAVE_SUCCESS: "비디오 저장 취소 성공",
  DELETE_VIDEO_SAVE_FAIL: "비디오 저장 취소 실패",

  /* 배너 불러오기 */
  GET_HOME_BANNER_SUCCES: "배너 불러오기 성공",
  GET_HOME_BANNER_FAIL: "배너 불러오기 실패",

  /* 비디오 포스트 */
  POST_VIDEO_SUCCESS: "비디오 업로드 성공",
  POST_VIDEO_FAIL: "비디오 업로드 실패",

  /* 추천 영상 불러오기(홈) */
  GET_VIDEO_RECOMMAND_SUCCESS: "추천 영상 불러오기 성공",
  GET_VIDEO_RECOMMAND_FAIL: "추천 영상 불러오기 실패",

  /* 마이모티브 동영상 불러오기 */
  GET_MYMOTIIV_VIDEOS_SUCCESS: "마이모티브 영상 불러오기 성공",
  GET_MYMOTIIV_VIDEOS_FAIL: "마이모티브 영상 불러오기 실패",

  /* 카테고리 동영상 불러오기 */
  GET_ALL_CATEGORY_SUCCESS: "모든 카테고리 불러오기 성공",
  GET_ALL_CATEGORY_FAIL: "모든 카테고리 불러오기 실패",

  /* 카테고리 키워드 불러오기 */
  GET_KEYWORD_CATEGORY_SUCCESS: "키워드 불러오기 성공",
  GET_KEYWORD_CATEGORY_FAIL: "키워드 불러오기 실패",

  /* 카테고리 태그 검색 */
  GET_CATEGORY_TAGS_SUCCESS: "태그 검색하기 성공",
  GET_CATEGORY_TAGS_FAIL: "태그 검색하기 실패"


};
