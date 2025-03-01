"use client"

import Image, {StaticImageData} from "next/image";

interface IconProps {
    src?: string | StaticImageData;
    loading?: "lazy" | "eager";
    alt: string;
    width?: number;
    height?: number;
}

export const Icon = ({src, loading, alt, width, height}: IconProps) => {
    if (!src) {
        return (<></>);
    }

    if (typeof src === "string") {
        return (<Image src={src} loading={loading ?? "lazy"} alt={alt} width={width ?? 40} height={height ?? 40} />);
    }

    return (<Image src={src} loading={loading} alt={alt} width={width} height={height} />);
}
