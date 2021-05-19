import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faUser,
  faCube,
  faBook,
  faBars,
  faMoon,
  faSun,
  faQuestion,
  faDiceTwo,
  faCommentAlt,
  faChevronDown,
  faChevronUp,
  faHeart,
  faThumbsUp,
  faThumbsDown,
  faSearch,
  faTabletAlt,
  faImages,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
// faDiceTwo for Nintendo Switch
export default function addIcon() {
  library.add(
    faGithub,
    faTwitter,
    faUser,
    faCube,
    faBook,
    faBars,
    faMoon,
    faSun,
    faQuestion,
    faDiceTwo,
    faCommentAlt,
    faChevronDown,
    faChevronUp,
    faHeart,
    faThumbsUp,
    faThumbsDown,
    faSearch,
    faTabletAlt,
    faImages,
    faUpload,
  );
}
