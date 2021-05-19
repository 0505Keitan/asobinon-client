import { SITE_NAME } from '@/lib/constants';
import { THEME_COLOR } from '@/theme/index';
import { Box, useColorMode } from '@chakra-ui/react';
import LinkChakra from './link-chakra';

type LogoMode = 'square' | 'rect';

interface Props {
  fill?: string;
  logoSelection: LogoMode;
}

const PathSelecter = ({ mode }: { mode: LogoMode }) => {
  let Path = (
    <>
      <path d=""></path>
    </>
  );

  if (mode == 'rect') {
    Path = (
      <>
        <path d="M0 170h150v40H0zm350 0h120v40H350zM160 270h180v40H160z" className="a"></path>
        <path
          d="M300 170h40v113h-40zm180 50h160v40H480zm0-50h160v40H480zm-370 20h40v120h-40z"
          className="a"
        ></path>
        <path
          d="M600 230h40v100h-40zm-120 60h120v40H480zm-130 0h90v40h-90zM23 270h97v40H23z"
          className="a"
        ></path>
        <path
          d="M0 250h40v80H0zm350-80h40v110h-40zm-190 0h30v90h-30zm100 0h30v90h-30z"
          className="a"
        ></path>
        <path d="M185 170h85v20h-85zm0 70h55v20h-55z" className="a"></path>
        <path
          d="M210 180h30v64h-30zm30 90h40v60h-40zm190-71h40v131h-40zM120 32h90V0h-90v32M0 0h80v31.88H0zm0 74h80v53.13H0zm120 0v96h30V85h40v85h20V74h-90m270-31V0h-8v74h-92V0h-40v32h30v42h-30v96h20V85h40v85h10v-42h110V85h40V43h-80m200 0h-70V0h-10v85h-40v85h10v-42h120V0h-10v43"
          className="a"
        ></path>
        <path d="M320 21h32v31.88h-32z" className="a"></path>
      </>
    );
  }

  return Path;
};

const Logo = ({ fill = THEME_COLOR, logoSelection }: Props) => {
  const { colorMode } = useColorMode();
  let svgProps = {
    //width: 50,
    width: 0,
    //height: 50,
    viewBox: '0 0 50 50',
  };
  if (logoSelection == null || logoSelection == 'square') {
    svgProps.viewBox = '0 0 100 100';
  }
  if (logoSelection == 'rect') {
    svgProps.viewBox = '0 0 600 80';
  }

  return (
    <Box area-label="ロゴ" fontWeight="bold" fontSize="1.6rem">
      <LinkChakra href={'/'} display="flex">
        <svg {...svgProps}>
          <g fill={colorMode == 'light' ? fill : 'white'}>
            <PathSelecter mode={logoSelection} />
          </g>
        </svg>
        {SITE_NAME}
      </LinkChakra>
    </Box>
  );
};

export default Logo;
