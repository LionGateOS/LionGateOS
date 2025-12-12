import type { EstimatorPreset } from "../data/models";

export function listPresets(): EstimatorPreset[] {
  return [
    {
      id: "framing-basic",
      name: "Framing Package · Basic",
      category: "framing",
      description: "Stud walls, plates, headers — ideal for small interior jobs."
    },
    {
      id: "drywall-standard",
      name: "Drywall Package · Standard",
      category: "drywall",
      description: "Board, tape, mud, basic sanding and fasteners."
    },
    {
      id: "bathroom-demo",
      name: "Bathroom Demo · Typical",
      category: "bathroom",
      description: "Demolition, disposal, basic protection and cleanup."
    },
    {
      id: "electrical-rough",
      name: "Electrical Rough-In · Small",
      category: "electrical",
      description: "Circuits, boxes, cable runs — small renovation scope."
    }
  ];
}
