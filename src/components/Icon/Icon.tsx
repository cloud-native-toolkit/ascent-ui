"use client"

import Image, {StaticImageData} from "next/image";

interface IconProps {
    src?: string | StaticImageData;
    loading?: "lazy" | "eager";
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

export const Icon = ({className, src, loading, alt, width, height}: IconProps) => {
    if (!src) {
        return (<></>);
    }

    if (typeof src === "string") {
        return (<Image className={className} src={src} loading={loading ?? "lazy"} alt={alt} width={width ?? 40} height={height ?? 40} />);
    }

    return (<Image className={className} src={src} loading={loading} alt={alt} width={width} height={height} />);
}
