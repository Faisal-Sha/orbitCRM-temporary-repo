
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  FileText, 
  Archive
} from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { generateDummyNotes } from "./data";

const NotesOverview = () => {
  const notes = generateDummyNotes();

  // Notes calculations
  const starredNotes = notes.filter(n => n.starred);
  const recentNotes = notes
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 5);

  const notesFolderData = [
    { name: "Work", value: notes.filter(n => n.folder === "Work").length, color: "#3b82f6" },
    { name: "Personal", value: notes.filter(n => n.folder === "Personal").length, color: "#22c55e" },
    { name: "Ideas", value: notes.filter(n => n.folder === "Ideas").length, color: "#f59e0b" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Notes Overview</h2>
        <Link to="/personal/notes">
          <Button variant="outline" className="bg-white">View All Notes</Button>
        </Link>
      </div>
      
      {/* Notes Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starred Notes</p>
                <p className="text-2xl font-bold">{starredNotes.length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Archived Notes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Archive className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recently Updated Notes</CardTitle>
            <CardDescription>Your most recently modified notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotes.map(note => (
                <div key={note.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{note.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {note.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {note.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{note.tags.length - 2}</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">
                    {format(note.lastModified, 'MMM dd')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Starred Notes</CardTitle>
            <CardDescription>Your favorite and important notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {starredNotes.map(note => (
                <div key={note.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <p className="font-medium truncate">{note.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {note.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {note.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{note.tags.length - 2}</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-2">
                    {format(note.createdDate, 'MMM dd')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notes by Folder</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={notesFolderData}
              series={[{ dataKey: "value", name: "Notes", color: "#6366f1", enabled: true }]}
              xAxisDataKey="name"
              height={250}
              showSeriesToggle={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotesOverview;
