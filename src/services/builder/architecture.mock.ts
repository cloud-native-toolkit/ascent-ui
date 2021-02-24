
import { ArchitectureDataApi } from './architecture.mock.api';
import { ArchiectureDataModel } from "../../models/builder/ArchitectureDataModel";


export class ArchitectureMock implements ArchitectureDataApi {
    async getArchitectureDetails(): Promise<ArchiectureDataModel[]> {
        return [

            {
                _id: "arch01",
                name: "red-hat-single-zone",
                short_desc: "SZR  OpenShift Cluster",
                long_desc: "Single zone OpenShift cluster that configures componets to be FS ready. Simple environment that can be used for demos and prototyping FS applications.",
                diagram_link_drawio: "openshift-single-zone.drawio",
                diagram_link_png: "openshift-single-zone.png",
                fs_compliant: "FALSE",
                partner_name: "None",
                confidential: "FALSE",
                production_ready: "FALSE"
            },
            {
                _id: "arch02",
                name: "red-hat-single-zone-devsecops",
                short_desc: "SZR OpenShift Developer Tools",
                long_desc: "Single zone OpenShift cluster that supports the common SDLC developer tools for Cloud-Native Application Development",
                diagram_link_drawio: "openshift-developer-tools.drawio",
                diagram_link_png: "openshift-developer-tools.png",
                fs_compliant: "FALSE",
                partner_name: "None",
                confidential: "FALSE",
                production_ready: "FALSE"
            },
            {
                _id: "arch03",
                name: "FS Cloud MZR Cloud Native",
                short_desc: "MZR OpenSift Cluster",
                long_desc: "Multi zone FS Cloud architecure solution using Bastion",
                diagram_link_drawio: "",
                diagram_link_png: "",
                fs_compliant: "FALSE",
                partner_name: "",
                confidential: "",
                production_ready: ""
            },
            {
                _id: "arch04",
                name: "EY Nexus",
                short_desc: "EY Nexus",
                long_desc: "Reference architecture for the EY Nexus project",
                diagram_link_drawio: "",
                diagram_link_png: "",
                fs_compliant: "FALSE",
                partner_name: "EY",
                confidential: "TRUE",
                production_ready: "FALSE"
            },
            {
                _id: "arch06",
                name: "Dienbold Nixdorf",
                short_desc: "Dienbold Nixdorf",
                long_desc: "Reference architecture for the Dienbold Nixdord FS Cloud solution",
                diagram_link_drawio: "",
                diagram_link_png: "",
                fs_compliant: "FALSE",
                partner_name: "Accenture",
                confidential: "TRUE",
                production_ready: "FALSE"
            }

        ];
    }


}