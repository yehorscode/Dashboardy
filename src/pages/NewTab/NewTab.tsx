import BGSetter from "@/components/NewTab/BGSetter"
import TimeBlock from "@/components/Blocks/time-block"


export default function NewTab() {
    return (
        <div className="h-full">
            <BGSetter/>
            <div className="flex justify-center">
                <TimeBlock/>
            </div>
        </div>
    )
}