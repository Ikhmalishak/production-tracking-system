<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $query = Project::query();

            // Order and paginate
            $projects = $query->orderBy('created_at', 'asc')->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $projects
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
                'error' => $e->getMessage() // or remove this in production
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validate the request
        try {
            //validate the request
            $validated = $request->validate([
                'project_code' => 'required|string|unique:projects,project_code',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            // Use DB transaction
            $project = DB::transaction(function () use ($validated) {
                return Project::create([
                    'project_code' => $validated['project_code'],
                    'name' => $validated['name'],
                    'description' => $validated['description'] ?? null,
                ]);
            });

            //return response
            return response()->json([
                'success' => true,
                'message' => 'Project created successfully',
                'data' => $project,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve projects',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //get single project
        try {
            // find project use id
            $project = Project::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $project,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "project not found",
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'project_code' => 'sometimes|required|string|unique:projects,project_code,' . $id,
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $project = Project::findOrFail($id);
            $project->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully',
                'data' => $project,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update project',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $project = Project::findOrFail($id);
            $project->delete();

            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete project',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
