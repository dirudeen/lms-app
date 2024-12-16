"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Chapter } from "@/types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd"
import { Grip, PencilIcon } from "lucide-react";
import { use, useEffect, useState } from "react";

interface ChaptersListProps {
  onReoder: (updateData: {id: string, position: number}[]) => void;
  onEdit: (id: string) => void;
  items: Chapter[];
}

export default function ChaptersList({items, onEdit, onReoder}: ChaptersListProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>(items) 
 

  // To prevent hydration errors with drag and drop on set isMounted when the component is rendered on the client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setChapters(items)
  }, [items])

  // if the component is rendered on the server, return null
  if(!isMounted){
    return null
  }
  

  const onDragEnd = (result: DropResult) => {
    if(!result.destination) return

    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1)
    setChapters(items)

    const bulkUpdate = updatedChapters.map((chapter) => {
      return {
        id: chapter.id,
        position: items.findIndex((item) => item.id === chapter.id)
      }
    })
    onReoder(bulkUpdate)
  }
  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
              {chapters.map((chapter, index) => (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <div 
                      className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm", 
                        chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        chapter.isPublished && "border-r-sky-200 hover:border-sky-200"
                      )}
                      {...provided.dragHandleProps}
                      >
                        <Grip className="size-5" />
                      </div>
                      {chapter.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {chapter.isFree && <Badge>Free</Badge>}
                        <Badge
                          className={cn("bg-slate-500", chapter.isPublished && "bg-sky-700")}
                        >{chapter.isPublished ? "Published" : "Draft"}</Badge>
                        <PencilIcon className="size-5 cursor-pointer hover:opacity-75 hover:-translate-y-0.5 transition" 
                          onClick={() => onEdit(chapter.id)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
          </div>
        )}

      </Droppable>

    </DragDropContext>
  )
}
