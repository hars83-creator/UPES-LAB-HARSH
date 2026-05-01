import PlancksConstant, { planckExperiment } from './PlancksConstant.jsx';
import Sonometer, { sonometerExperiment } from './Sonometer.jsx';
import HallEffect, { hallExperiment } from './HallEffect.jsx';
import CircularCoil, { circularCoilExperiment } from './CircularCoil.jsx';
import FaradaysLaw, { faradayExperiment } from './FaradaysLaw.jsx';
import OpticalFiber, { opticalFiberExperiment } from './OpticalFiber.jsx';
import LaserDiffraction, { laserDiffractionExperiment } from './LaserDiffraction.jsx';
import SolarCell, { solarCellExperiment } from './SolarCell.jsx';
import PhotoelectricEffect, { photoelectricExperiment } from './PhotoelectricEffect.jsx';
import PNJunctionDiode, { pnJunctionExperiment } from './PNJunctionDiode.jsx';

export const experiments = [
  { ...planckExperiment, Component: PlancksConstant },
  { ...sonometerExperiment, Component: Sonometer },
  { ...hallExperiment, Component: HallEffect },
  { ...circularCoilExperiment, Component: CircularCoil },
  { ...faradayExperiment, Component: FaradaysLaw },
  { ...opticalFiberExperiment, Component: OpticalFiber },
  { ...laserDiffractionExperiment, Component: LaserDiffraction },
  { ...solarCellExperiment, Component: SolarCell },
  { ...photoelectricExperiment, Component: PhotoelectricEffect },
  { ...pnJunctionExperiment, Component: PNJunctionDiode }
];
